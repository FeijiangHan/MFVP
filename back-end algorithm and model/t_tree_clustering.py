import warnings
warnings.filterwarnings("ignore")

from util import write_json, read_json, read_csv_all
from sklearn import metrics
from scipy.optimize import linear_sum_assignment
import numpy as np
from config import all_func, idx2type, user_with_semantic, user_non_semantic, SENSITIVE_FUNC
import zss
from apted import APTED
from config import ConConfig
from apted.helpers import Tree
import sys


# extra func
def get_function_type(func):
    func_type = ''
    for ic in range(len(all_func)):
        if func in all_func[ic]:
            func_type = idx2type[ic]
            break
    return func_type


# extra func
def get_new_func(func):
    caller = func.split('|')[0]
    callee = func.split('|')[1]
    user_func = user_with_semantic + user_non_semantic
    if caller in user_func:
        caller = 'user'
    if callee in user_func:
        callee = 'user'
    func = caller + '|' + callee
    return func


# 同一条边仅出现一次的tree
def get_old_tree(uuid, edge_list):
    # 新增边只会在"叶子节点"中增加
    opcode_tree = {
        "name": "__main__",
        "unique_id": uuid,
        "children": []
    }

    edge_list_new = []
    for edge in edge_list:
        if edge not in edge_list_new:
            edge_list_new.append(edge)
    edge_list = edge_list_new

    leaf_node_list = [opcode_tree]
    for edge in edge_list:
        callee = edge.split('|')[1]
        caller = edge.split('|')[0]

        for i in range(len(leaf_node_list)):
            leaf_node = leaf_node_list[i]
            if caller == leaf_node["name"]:
                leaf_node["children"].append({
                    "name": callee,
                    "caller": caller,
                    "children": [],
                    "is_sensitive": callee in SENSITIVE_FUNC,
                    "is_common": False,
                    "call_num": 1,
                })

                for new_leaf_node in leaf_node_list:
                    if new_leaf_node["name"] == callee:
                        leaf_node_list.remove(new_leaf_node)
                leaf_node_list.append(leaf_node["children"][len(leaf_node["children"]) - 1])
                break

    return opcode_tree


# 合并节点tree
def get_tree(uuid, edge_list):
    # 给定一个序列, ['a|b', 'a|c', 'a|d', 'a|b', 'b|c']
    # edge_list = ['__main__|b', '__main__|c', '__main__|d', '__main__|b', 'b|c']

    # 新增边只会在"叶子节点"中增加
    opcode_tree = {
        "name": "__main__",
        "unique_id": uuid,
        "children": []
    }

    leaf_node_list = [opcode_tree]
    for edge in edge_list:
        callee = edge.split('|')[1]
        caller = edge.split('|')[0]

        for i in range(len(leaf_node_list)):
            leaf_node = leaf_node_list[i]
            if caller == leaf_node["name"]:
                leaf_node["children"].append({
                    "name": callee,
                    "caller": caller,
                    "children": [],
                    "is_sensitive": callee in SENSITIVE_FUNC,
                    "is_common": False,
                    "call_num": 1
                })

                for new_leaf_node in leaf_node_list:
                    if new_leaf_node["name"] == callee:
                        leaf_node_list.remove(new_leaf_node)
                leaf_node_list.append(leaf_node["children"][len(leaf_node["children"]) - 1])
                break
    # 合并tree
    not_leaf_node_list = [opcode_tree['children']]
    while not_leaf_node_list:
        leaf_node_l = []
        now_node = not_leaf_node_list[0]
        not_leaf_node = []
        for j in range(len(now_node)):
            not_leaf_node = now_node[0]
            if not_leaf_node['children'] or not_leaf_node["is_sensitive"]:
                # 合并节点的函数类型
                type_temp = dict()
                for i in range(len(leaf_node_l) - 1, -1, -1):
                    if get_function_type(leaf_node_l[i]['name']) not in type_temp:
                        type_temp[get_function_type(leaf_node_l[i]['name'])] = 1
                    else:
                        type_temp[get_function_type(leaf_node_l[i]['name'])] += 1

                type_list = []
                for func in type_temp:
                    type_list.append([func, type_temp[func]])

                # 添加合并节点
                if type_list:
                    if len(type_list) > 1:
                        is_common = True
                        for ln in leaf_node_l:
                            is_common = False
                        now_node.append({
                            "name": "common",
                            "caller": leaf_node_l[0]['caller'],
                            "children": [],
                            "is_sensitive": False,
                            "is_common": is_common,
                            "type_list": type_list,
                            "call_num": 1
                        })
                    else:
                        now_node.append({
                            "name": leaf_node_l[0]['name'],
                            "caller": not_leaf_node['caller'],
                            "children": [],
                            "is_sensitive": False,
                            "is_common": False,
                            "type_list": type_list,
                            "call_num": 1
                        })

                # 清空叶子节点缓存
                leaf_node_l = []
                # 修改当前遍历节点
                not_leaf_node['type_list'] = []
                temp = not_leaf_node
                for cc in range(1, len(now_node)):
                    now_node[cc - 1] = now_node[cc]
                now_node[len(now_node) - 1] = temp

                # 非叶子节点添加至遍历列表中
                if not_leaf_node['children']:
                    not_leaf_node_list.append(not_leaf_node['children'])
            else:
                leaf_node_l.append(not_leaf_node)
                # 去掉当前遍历节点
                now_node.remove(not_leaf_node)

        if leaf_node_l:
            # 合并节点的函数类型
            type_temp = dict()
            for i in range(len(leaf_node_l) - 1, -1, -1):
                if get_function_type(leaf_node_l[i]['name']) not in type_temp:
                    type_temp[get_function_type(leaf_node_l[i]['name'])] = 1
                else:
                    type_temp[get_function_type(leaf_node_l[i]['name'])] += 1

            type_list = []
            for func in type_temp:
                type_list.append([func, type_temp[func]])

            # 添加合并节点
            if len(type_list) > 1:
                is_common = True
                for ln in leaf_node_l:
                    is_common = False
                now_node.append({
                    "name": "common",
                    "caller": leaf_node_l[0]['caller'],
                    "children": [],
                    "is_sensitive": False,
                    "is_common": is_common,
                    "type_list": type_list,
                    "call_num": 1
                })
            else:
                now_node.append({
                    "name": leaf_node_l[0]['name'],
                    "caller": not_leaf_node['caller'],
                    "children": [],
                    "is_sensitive": False,
                    "is_common": False,  # 先设置为False
                    "type_list": type_list,
                    "call_num": 1
                })

        # 去掉当前遍历非叶子节点
        not_leaf_node_list.remove(now_node)

    return opcode_tree


# 构建不合并的前端结构的树
def get_not_common_tree(uuid, edge_list):
    # 新增边只会在"叶子节点"中增加
    opcode_tree = {
        "name": "__main__",
        "unique_id": uuid,
        "children": []
    }

    temp = []
    for func in edge_list:
        func = get_new_func(func)
        if func not in temp:
            temp.append(func)
    edge_list = temp

    leaf_node_list = [opcode_tree]
    for edge in edge_list:
        callee = edge.split('|')[1]
        caller = edge.split('|')[0]

        for i in range(len(leaf_node_list)):
            leaf_node = leaf_node_list[i]
            if caller == leaf_node["name"]:
                leaf_node["children"].append({
                    "name": callee,
                    "caller": caller,
                    "children": [],
                    "is_sensitive": callee in SENSITIVE_FUNC,
                    "is_common": False
                })

                for new_leaf_node in leaf_node_list:
                    if new_leaf_node["name"] == callee:
                        leaf_node_list.remove(new_leaf_node)
                leaf_node_list.append(leaf_node["children"][len(leaf_node["children"]) - 1])
                break
    return opcode_tree



def single_to_not_single(simple_info):
    new_simple_info = dict()
    for uuid in simple_info:
        new_simple_info[uuid] = []
        for ic in range(0, len(simple_info[uuid]), 2):
            new_simple_info[uuid].append(simple_info[uuid][ic] + '|' + simple_info[uuid][ic + 1])
    return new_simple_info


def get_one_part(node, now_str):
    for nd in node:
        now_str = now_str + '{' + get_function_type(nd['name']) + '#' + nd['name']
        now_str = get_one_part(nd['children'], now_str)
        now_str += '}'
    return now_str


def get_dist_tree(my_tree):
    dist_tree = '{MMAIN#__main__'
    # 深度遍历
    if my_tree['children']:
        add_str = get_one_part(my_tree['children'], '')
        dist_tree = dist_tree + add_str
    dist_tree += '}'
    return dist_tree


# 得到相似度矩阵
def get_similarity_matrix(tree_mode, user_name, label_name):
    simple_info = single_to_not_single(read_json('./data/user_name/' + user_name + '.json'))
    result_f = read_json('./data/label_data/' + label_name + '.json')
    dist_matrix = dict()
    # 先计算所有树结构信息
    tree_info = dict()  # 保存树结构信息
    for uuid in result_f:
        if tree_mode == 'old_tree':
            TR = get_old_tree(uuid, simple_info[uuid])
            tree_info[uuid] = get_dist_tree(TR)
        elif tree_mode == 'common_tree':
            tree_info[uuid] = get_dist_tree(get_tree(uuid, simple_info[uuid]))
        elif tree_mode == 'not_common_tree':
            tree_info[uuid] = get_dist_tree(get_not_common_tree(uuid, simple_info[uuid]))
        else:
            assert 1 == 2

    cc = 0
    for uuid1 in result_f:
        cc += 1
        sys.stdout.write('\r' + str(cc / len(result_f)) + '%')
        for uuid2 in result_f:
            if uuid1 == uuid2:
                dist_matrix[uuid1 + '#' + uuid2] = 0
                continue

            if uuid2 + '#' + uuid1 in dist_matrix:
                dist_matrix[uuid1 + '#' + uuid2] = dist_matrix[uuid2 + '#' + uuid1]
                continue

            tree_a = tree_info[uuid1]
            tree_b = tree_info[uuid2]

            # 计算TED
            tree1, tree2 = map(Tree.from_text, [tree_a, tree_b])
            apted = APTED(tree1, tree2, config=ConConfig())
            dist = apted.compute_edit_distance()
            dist_matrix[uuid1 + '#' + uuid2] = dist

    write_json(dist_matrix, './data/T_Tree_Data/edit/matrix_' + user_name + '_' + tree_mode + '.json')

    return dist_matrix

if __name__ == '__main__':
    tree_mode_list = [ 'not_common_tree','common_tree', 'old_tree']
    user_name_list = ['DS1_user_name', 'DS2_user_name', 'DS3_user_name',
                      'DS4_user_name']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']


    for im in range(len(user_name_list)):
        print('==========' + tree_mode_list[im] + ' & ' + user_name_list[im] + '============')
        print('获取相似度矩阵...')
        matrix_info_d = get_similarity_matrix(tree_mode_list[im], user_name_list[im], label_name_list[im])




























