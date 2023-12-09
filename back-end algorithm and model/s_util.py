# 导入需要的包
import warnings
warnings.filterwarnings("ignore")
from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
import json
from collections import defaultdict
import math
import operator
import matplotlib
from util import read_json, t_clustering, write_json
from sklearn import metrics
from scipy.optimize import linear_sum_assignment
matplotlib.use('TkAgg')


# 拼接
def get_sentence_vec_1(word2vec, seq, seq_len):
    uuid_list = [uuid for uuid in seq]
    s_a = []
    for uuid in seq:
        s_a.append([])
        if len(seq[uuid]) > seq_len:
            for func in seq[uuid][0:seq_len]:
                s_a[len(s_a) - 1].extend(word2vec[func])
        else:
            for func in seq[uuid]:
                s_a[len(s_a) - 1].extend(word2vec[func])
            s_a[len(s_a) - 1].extend([0] * ((seq_len - len(seq[uuid])) * len(word2vec[func])))
        assert len(s_a[len(s_a) - 1]) == seq_len * len(word2vec[func])
    return uuid_list, s_a


# avg
def get_sentence_vec_2(word2vec, seq):
    uuid_list = [uuid for uuid in seq]
    s_a = []
    for uuid in seq:
        s_a.append(np.array(word2vec[seq[uuid][0]]))
        for func in seq[uuid][1:]:
            s_a[len(s_a) - 1] = np.add(s_a[len(s_a) - 1], np.array(word2vec[func]))
        s_a[len(s_a) - 1] = np.divide(np.array(s_a[len(s_a) - 1], dtype='float64'), len(seq[uuid]))
    return uuid_list, s_a

def feature_select(dataset):
    # 总词频统计
    doc_frequency = defaultdict(int)  # 记录每个词出现的次数，可以把它理解成一个可变长度的list，只要你索引它，它就自动扩列
    for file in dataset:
        for word in file:
            doc_frequency[word] += 1
    # 计算每个词的TF值
    word_tf = {}  # 存储没个词的tf值
    for i in doc_frequency:
        word_tf[i] = doc_frequency[i] / sum(doc_frequency.values())  # sum(doc.frequency.values)

    # 计算每个词的IDF值
    doc_num = len(dataset)
    word_idf = {}  # 存储每个词的idf值
    word_doc = defaultdict(int)  # 存储包含该词的文档数
    for word in doc_frequency:
        for file in dataset:
            if word in file:
                word_doc[word] += 1
    # word_doc和doc_frequency的区别是word_doc存储的是包含这个词的文档数，即如果一个文档里有重复出现一个词则word_doc < doc_frequency
    for word in doc_frequency:
        word_idf[word] = math.log(doc_num / (word_doc[word] + 1))

    # 计算每个词的TF*IDF的值
    word_tf_idf = {}
    for word in doc_frequency:
        word_tf_idf[word] = word_tf[word] * word_idf[word]

    # 对字典按值由大到小排序
    dict_feature_select = sorted(word_tf_idf.items(), key=operator.itemgetter(1), reverse=True)
    return dict_feature_select


# avg + tf_idf
def get_sentence_vec_3(word2vec, seq):
    uuid_list = [uuid for uuid in seq]
    seq_list = [seq[s_uuid] for s_uuid in seq]
    s_a = []
    word_size = 0
    for func in word2vec:
        word_size = len(word2vec[func])
        break

    features = feature_select(seq_list)  # 所有词的TF-IDF值
    func2tfidf = {fe[0]: fe[1] for fe in features}
    f_lambda = 1

    for uuid in seq:
        sentence = np.array([0.0] * (word_size * 2))
        for c_i in range(0, len(seq[uuid]), 2):
            callee = seq[uuid][c_i]
            caller = seq[uuid][c_i + 1]
            sentence[0: word_size] += (np.array(word2vec[callee]) * (func2tfidf[callee] * f_lambda))
            sentence[word_size: 2 * word_size] += (np.array(word2vec[caller]) * (func2tfidf[caller] * f_lambda))
        sentence /= (len(seq[uuid]) / 2)
        s_a.append(sentence)

    return uuid_list, s_a

def make_data_sim(user_name):
    sample_info = read_json(
        './data/user_name/' + user_name + '_user_name.json')
    sample_list = [sample_info[uuid] for uuid in sample_info]
    corpus = ''

    for i in range(len(sample_list)):
        corpus += ' '.join(sample_list[i]) + '\n'

    with open('./data/S_CBOW_Data/S_CBOW_{}.txt'.format(user_name), 'w') as f:
        f.write(corpus)
    f.close()

    with open('./data/S_SIMCSE_Data/S_SIMCSE_{}.txt'.format(user_name), 'w') as f:
        f.write(corpus)
    f.close()


import nltk
from util import read_json, write_csv, read_csv_all, write_json


def add_msv_periodicity(test_tuple):
    import copy
    periodicity_max = ['', 0]
    periodicity_list = []
    periodicity_count = dict()
    new_tuple = list()
    i = 0
    while i < len(test_tuple):
        leaf_half = int((len(test_tuple) - i) / 2)
        is_change = False
        for j in range(1, leaf_half + 1):
            if test_tuple[i: i + j] == test_tuple[i + j: i + 2 * j]:
                is_continue = True
                is_change = True
                periodicity_temp = 2
                start_index = i + 2 * j
                end_index = i + 2 * j

                while is_continue:
                    if test_tuple[start_index: start_index + j] == test_tuple[i: i + j]:
                        periodicity_temp += 1
                        is_continue = True
                        start_index += j
                        end_index = start_index
                    else:
                        is_continue = False

                change_tuple = test_tuple[i: int(i + ((end_index - i) / periodicity_temp))]
                change_key = "#".join(change_tuple)
                periodicity_list.append(change_tuple)
                if periodicity_temp > periodicity_max[1]:
                    periodicity_max[0] = copy.deepcopy(change_tuple)
                    periodicity_max[1] = periodicity_temp

                if change_key not in periodicity_count:
                    periodicity_count[change_key] = periodicity_temp
                else:
                    periodicity_count[change_key] += periodicity_temp

                # 先合并污点信息
                new_tuple.extend(change_tuple)
                i = end_index
                break
        if not is_change:
            new_tuple.extend([test_tuple[i]])
            i += 1

    return new_tuple, periodicity_count, periodicity_max, periodicity_list

def de_pattern1(seq):
    new_seq = []
    last_edge = ''
    for edge in seq:
        if edge != last_edge:
            new_seq.append(edge)
            last_edge = edge
    return new_seq

def create_connected_subgraph(seq_common_list):
    connected_subgraph_dict = {}
    viewed_dict = {edge: False for edge in seq_common_list}
    subgraph_idx = 0
    for edge in seq_common_list:
        if not viewed_dict[edge]:
            subgraph_idx += 1
            connected_subgraph_dict[subgraph_idx] = {edge}
            viewed_dict[edge] = True
            is_change = True
            now_node_set = set(edge.split('|'))
            while is_change:
                is_change = False
                for edge2 in seq_common_list:
                    if not viewed_dict[edge2]:
                        if now_node_set & set(edge2.split('|')):
                            connected_subgraph_dict[subgraph_idx].add(edge2)
                            now_node_set = now_node_set | set(edge2.split('|'))
                            viewed_dict[edge2] = True
                            is_change = True

    connected_subgraph_list = []
    for idx in connected_subgraph_dict:
        connected_subgraph_list.append([])
        for edge in connected_subgraph_dict[idx]:
            connected_subgraph_list[len(connected_subgraph_list) - 1].append(edge)

    # 只取最大的公共子树
    if connected_subgraph_list:
        connected_subgraph = connected_subgraph_list[0]
        for cs in connected_subgraph_list:
            if len(cs) > len(connected_subgraph):
                connected_subgraph = cs
    else:
        connected_subgraph = []

    return connected_subgraph


def is_connection(edge, now_connection_subgraph):
    if not now_connection_subgraph:
        return True

    is_connection_subgraph = False
    for edge2 in now_connection_subgraph:
        if set(edge.split('|')) & set(edge2.split('|')):
            is_connection_subgraph = True
            break
    return is_connection_subgraph


def is_some_same(common_tree1, common_tree2):
    # 超过阈值才判定为some same
    same_value = 0.5
    is_same = False
    for i, common_tree_i in enumerate(common_tree1):
        for j, common_tree_j in enumerate(common_tree2):
            if len(set(common_tree_i) & set(common_tree_j)) / len(set(common_tree_i) | set(common_tree_j)) > same_value:
                is_same = True
    return is_same



def de_pattern3(seq, uuid=''):
    # 0. 去模式1
    seq = de_pattern1(seq)
    de_pattern1_seq = seq
    # 0.1 去模式2
    seq = add_msv_periodicity(seq)[0]
    de_pattern2_seq = seq

    de_pattern_simple_seq = []
    for func_pair in de_pattern1_seq:
        if func_pair not in de_pattern_simple_seq:
            de_pattern_simple_seq.append(func_pair)

    # 1. 分段 若不连通也要分割 第一个在重复段也要断 改：：
    edge_list = []  # 保留序列段
    now_edges = []

    for edge_idx, edge in enumerate(seq):
        if not is_connection(edge, now_edges):  # 如果不连通
            edge_list.append(now_edges)
            now_edges = [edge]
            continue

        if edge not in now_edges:
            now_edges.append(edge)
        else:
            if now_edges[0: now_edges.index(edge)]:
                edge_list.append(now_edges[0: now_edges.index(edge)])
            if now_edges[now_edges.index(edge): len(now_edges)]:
                edge_list.append(now_edges[now_edges.index(edge): len(now_edges)])
            now_edges = [edge]

        if edge_idx == len(seq) - 1:
            if now_edges:
                edge_list.append(now_edges)

    # print('edge_list:', len(edge_list), edge_list)

    # 如果只有一段，直接返回

    if len(edge_list) <= 1:
        return seq, de_pattern1_seq, de_pattern2_seq, de_pattern_simple_seq

    # 2.计算邻近段的公共子树
    common_tree_list = []
    # 计算邻接序列段对应书结构的公共子树
    for i in range(len(edge_list) - 1):
        if len(set(edge_list[i]) & set(edge_list[i + 1])) <= len(
                set(edge_list[i]) | set(edge_list[i + 1])) / 2:  # 如果相似度小于阈值 则common_tree为[]
            common_tree = []
        else:
            common_tree = create_connected_subgraph(list(set(edge_list[i]) & set(edge_list[i + 1])))
        common_tree_list.append(common_tree)

    # print('common_tree_list:', len(common_tree_list), common_tree_list)

    # 3.若存在公共子图，且连续相同，则识别为pattern3
    # pattern3_array 保存序列段对应所属的公共子树，0表示无模式
    idx = 1
    pattern3_array = []
    last_common_tree = []

    common_tree_idx = 0
    while common_tree_idx < len(common_tree_list):
        common_tree = common_tree_list[common_tree_idx]
        if common_tree:
            pattern3_array.append(idx)
            common_tree_idx += 1

            is_continue = True
            while is_continue:
                if common_tree_idx >= len(common_tree_list):
                    break

                common_tree = common_tree_list[common_tree_idx]
                is_continue = False
                if is_some_same(last_common_tree, common_tree):
                    pattern3_array.append(idx)
                    is_continue = True
                    common_tree_idx += 1
            pattern3_array.append(idx)
            last_common_tree = common_tree
            common_tree_idx += 1
            idx += 1
        else:
            pattern3_array.append(0)
            last_common_tree = common_tree
            common_tree_idx += 1
        continue

    # 结尾处理
    if not (common_tree_list[len(common_tree_list) - 1]):
        pattern3_array.append(0)
    else:
        pattern3_array.append(pattern3_array[len(pattern3_array) - 1])

    # print('pattern3_array:', len(pattern3_array), pattern3_array)

    # 对于固定结构是while循环中的，获取子树并集
    # 对于固定结构是功能结构，保留MSE中第一个函数
    pattern3_idx = []  # 保存识别为pattern3的连续序列段idxs
    remove_idx = []  # 保存要删除的序列段idx
    replace_func_list = []  # 保存删除序列段的替换序列
    last_idx = -1  # 前一个模式idx
    i = 0
    while i < len(pattern3_array):
        idx = pattern3_array[i]
        if idx != last_idx or i == len(pattern3_array) - 1:  # 连续识别
            if pattern3_idx:
                # 处理pattern3_idx中对应的序列
                not_common_edge = set()  # 保存非公共部分
                for j, idx_in in enumerate(pattern3_idx):
                    if j == len(pattern3_idx) - 1:  # 去尾
                        common_edge = set(common_tree_list[idx_in - 1])
                    else:
                        common_edge = set(common_tree_list[idx_in])

                    not_common_edge = not_common_edge | (set(edge_list[idx_in]) - common_edge)

                # 固定函数对为循环中MSE
                if len(not_common_edge) <= len(common_tree_list[pattern3_idx[0]]):  # 不够严谨，因为common_tree_list长度不为1， 改：：
                    # 定位起点和终点，起点前和终点后的保留
                    start_point = 0
                    for cc, sp in enumerate(edge_list[pattern3_idx[0]]):
                        if sp in common_tree_list[pattern3_idx[0]]:  # 不够严谨，因为common_tree_list长度不为1， 改：：
                            start_point = cc
                            break

                    # end_edge = edge_list[pattern3_idx[len(pattern3_idx) - 1]]
                    # end_point = len(end_edge) - 1
                    # for cc in range(end_point, -1, -1):
                    #     if end_edge[cc] in common_tree_list[pattern3_idx[0]]:
                    #         end_point = cc
                    #         break

                    # 从start_point 到 end_point 建树
                    pre_func = []
                    # after_func = []    # 不要after_func，改为最后一段如果在change-func中，则不添加，反之添加

                    for fp_idx, func_pair in enumerate(edge_list[pattern3_idx[0]]):
                        if fp_idx < start_point:
                            pre_func.append(func_pair)
                        else:
                            break

                    # for fp_idx, func_pair in enumerate(end_edge):
                    #     if fp_idx > end_point:
                    #         after_func.append(func_pair)

                    remain_func = []
                    for cc in range(0, len(pattern3_idx)):
                        if cc == 0:
                            for pic, func_pair in enumerate(edge_list[pattern3_idx[cc]]):
                                if pic >= start_point:
                                    if func_pair not in remain_func:
                                        remain_func.append(func_pair)
                            continue
                        if cc == len(pattern3_idx) - 1:
                            for pic, func_pair in enumerate(edge_list[pattern3_idx[len(pattern3_idx) - 1]]):
                                if func_pair not in remain_func:
                                    remain_func.append(func_pair)
                            break

                        for func_pair in edge_list[pattern3_idx[cc]]:
                            if func_pair not in remain_func:
                                remain_func.append(func_pair)

                    change_func = pre_func + remain_func  # + after_func
                    remove_idx.append(pattern3_idx)
                    replace_func_list.append(change_func)
                # else:   # 固定函数对为功能结构
                # # 保留固定函数对中首个函数 或不处理

            if idx == 0:
                last_idx = -1
                pattern3_idx = []
            else:
                last_idx = idx
                pattern3_idx = [i]
            i += 1
        else:
            pattern3_idx.append(i)
            i += 1

    remove_idx.append([])  # 最后结尾

    # print('replace_func_list:', replace_func_list)
    # print(remove_idx)

    test_seq = []
    for i in range(len(edge_list)):
        for edge in edge_list[i]:
            test_seq.append(edge)

    new_seq = []
    now_idx = 0
    i = 0
    while i < len(edge_list):
        if i not in remove_idx[now_idx]:
            for edge in edge_list[i]:
                new_seq.append(edge)
            i += 1
        else:
            for edge in replace_func_list[now_idx]:
                new_seq.append(edge)
            i = i + len(remove_idx[now_idx])
            now_idx += 1
    # print('result:', new_seq)

    if len(new_seq) > len(de_pattern2_seq):
        print(uuid)
        assert len(new_seq) <= len(de_pattern2_seq)

    return new_seq, de_pattern1_seq, de_pattern2_seq, de_pattern_simple_seq



from config import mor_list, all_func, idx2type
import numpy as np


def get_all_self_mor(func_name):  # @cz
    return nltk.PorterStemmer().stem_word(func_name)


def get_func_type(func_name):
    for s_i in range(len(all_func)):
        if func_name in all_func[s_i]:
            return idx2type[s_i] + '_' + func_name
    return idx2type[len(idx2type) - 1] + '_' + func_name


def get_mor_by_func(func_name):
    mor_ = []
    for s_mor in mor_list:
        if s_mor in func_name:
            mor_.append(s_mor)
    return mor_


def get_public_data(s_input_file):
    # 0.获取word中自带的mor
    # 词向量应该在所有数据中训练，针对不同数据集再微调
    # 获取规则：抛去无意义的user类函数名，在剩下类别中，利用'_'以及大小写字符转换作为分割符进行切割，取长度大于1且 出现次数高于k0的作为
    sample_d = s_input_file
    sample_l = [[func.lower() for func in sample_d[s_uuid]] for s_uuid in sample_d]
    letter = []
    for seq in sample_l:
        letter.extend(seq)
    # letter = np.array(letter).flatten()
    letter = set(letter)
    # letter2idx = {le: idx for idx, le in enumerate(letter)}
    mor_s_count = {}
    # for func in letter:
    write_json(list(letter), './data/S_CBOW_Data/public/letter.json')
    # write_json(list(letter2idx), './data/S_CBOW_Data/public/letter2idx.json')

    # 1.添加前缀
    # 给函数添加前缀类型
    opcode_info_add_mor = {s_uuid: [get_func_type(s_func) for s_func in sample_d[s_uuid]] for s_uuid in sample_d}
    sample_l_a = [[s_func for s_func in opcode_info_add_mor[s_uuid]] for s_uuid in opcode_info_add_mor]
    letter_add_mor = []
    for seq in sample_l_a:
        letter_add_mor.extend(seq)
    letter_add_mor = set(letter_add_mor)
    write_json(opcode_info_add_mor, './data/S_CBOW_Data/public/sample_add_mor.json')  # 添加前缀后的sample_add_mor
    write_json(list(letter_add_mor), './data/S_CBOW_Data/public/letter_add_mor.json')  # 添加前缀后的letter

    # 生成函数到词素的键值对
    s_mor_list = [x.lower() for x in list(set(mor_list))]  # 要改 按照长度排序
    s_mor_list = sorted(s_mor_list, key=lambda x: len(x), reverse=True)
    # mor2idx = {s_mor: idx for idx, s_mor in enumerate(s_mor_list)}
    # idx2mor = {idx: s_mor for idx, s_mor in enumerate(s_mor_list)}
    func2mor = dict()
    for s_func in letter_add_mor:
        s_func = s_func.lower()
        func2mor[s_func] = list()
        if 'musern' in s_func:   # 用户自定义无意义函数
            func2mor[s_func] = ['musern'.lower()]
        else:
            func_mor = get_mor_by_func(s_func)
            func2mor[s_func] = [s_mor.lower() for s_mor in func_mor]

    s_max_mor = 0
    for s_func in func2mor:
        if len(func2mor[s_func]) > s_max_mor:
            s_max_mor = len(func2mor[s_func])
    write_json(func2mor, './data/S_CBOW_Data/public/func_mor.json')
    # write_json(mor2idx, './data/S_CBOW_Data/public/mor2idx.json')
    # write_json(idx2mor, './data/S_CBOW_Data/public/idx2mor.json')


# get_public_data()



def get_word_mask(s_input_file, output_path, vector_len):
    sample_d = s_input_file
    sample_d_a = read_json('./data/S_CBOW_Data/public/sample_add_mor.json')
    sample_add_mor = [sample_d_a[s_uuid] for s_uuid in sample_d]
    uuid_list = [s_uuid for s_uuid in sample_d]

    letter_add_mor = []
    for seq in sample_add_mor:
        letter_add_mor.extend(seq)
    letter_add_mor = set(letter_add_mor)
    letter_add_mor.add('mnull_pad')
    letter_add_mor = list(letter_add_mor)
    letter2idx = {le: int(idx) for idx, le in enumerate(letter_add_mor)}
    idx2letter = {int(idx): le for idx, le in enumerate(letter_add_mor)}

    func_mor_a = read_json('./data/S_CBOW_Data/public/func_mor.json')
    func_mor_a['mnull_pad'] = ['pmd']

    func_mor = {le: func_mor_a[le.lower()] for le in letter2idx}
    max_ = max([len(func_mor[wm]) for wm in func_mor])  # 最大词素
    for func in func_mor:
        if len(func_mor[func]) < max_:
            for i in range(max_ - len(func_mor[func])):
                func_mor[func].append('pmd')  # 填充pmd对齐
    word_map = func_mor      # word_map 保存word到mor的映射

    mor_list_m = [func_mor[s_func] for s_func in func_mor]
    s_mor_list = []
    for seq in mor_list_m:
        s_mor_list.extend(seq)
    s_mor_list = list(set(s_mor_list))
    s_mor_list.append('pmd')

    # s_mor_list.append('UMK')
    s_mor_list = sorted(s_mor_list, key=lambda x: len(x), reverse=True)
    mor2idx = {mor: i for i, mor in enumerate(s_mor_list)}

    word_map_idx = {s_func: [mor2idx[s_mor] for s_mor in word_map[s_func]] for s_func in word_map}   # word_map_idx 保存word到mor_idx的映射
    word_map_idx['pad'] = [mor2idx['pmd']] * max_   # PAD用以填充句子
    # word_map_idx['UNK'] = [len(mor2idx) - 1] * max_

    # mask trick
    mor_mask_dict = dict()
    for s_func in word_map:
        mor_mask = list()
        for mor in word_map[s_func]:
            if mor.lower() == 'pmd':
                mor_mask.extend([0] * vector_len)
            else:
                mor_mask.extend([1] * vector_len)
        mor_mask_dict[s_func] = mor_mask

    mor_mask_dict['pmd'] = [0] * vector_len * max_
    write_json(mor2idx, output_path + 'mor2idx.json')
    write_json(word_map_idx, output_path + 'word_map.json')
    write_json(mor_mask_dict, output_path + 'mor_mask.json')
    write_json(uuid_list, output_path + 'uuid.json')
    write_json(letter2idx, output_path + 'letter2idx.json')
    write_json(idx2letter, output_path + 'idx2letter.json')
    return word_map_idx, mor_mask_dict, mor2idx, letter2idx, idx2letter, max_


def get_corpus(s_input_file, seq_len):
    sample_d = s_input_file
    sample_d_a = read_json('./data/S_CBOW_Data/public/sample_add_mor.json')
    sample_add_mor = [sample_d_a[s_uuid] for s_uuid in sample_d]
    corpus = []
    for seq in sample_add_mor:
        if len(seq) > seq_len:
            corpus.extend(seq[0: seq_len])
        else:
            corpus.extend(seq)
    return corpus




