"""
Graph2Vec是一个用于学习图的结构表示的模型。该代码实现了基于Graph2Vec对用户操作序列图的表示学习及聚类分析。

make_data_graph2vec函数将用户操作序列数据转换为图格式表示并写入文件
读取不同数据集的Graph2Vec结果,提取向量表示
加载标签信息和样本id
对数据进行预处理,包括随机打乱
调用t_clustering函数进行聚类计算和评估和可视化,实现基于Graph2Vec的聚类任务
本代码通过Graph2Vec提取用户操作图结构特征,并实践基于向量表示的图样本聚类分析。
"""

import warnings
warnings.filterwarnings("ignore")


from util import read_json, write_json, read_csv_all, t_clustering
from config import all_func

# 匹配func_name，返回其类型编号
def func2type_idx(func_name):
    for idx, func_list in enumerate(all_func):
        if func_name in func_list:
            return idx

    return 0

# 将原始opcode数据集转换为二维格式
def make_data_graph2vec(user_name):
    now_output_path = './data/user_name/' + user_name + '_user_name.json'
    opcode_info = read_json(now_output_path)
    

    node2id = {}

    import os
    if not os.path.exists('./data/G_Graph2Vec_Data/{}/'.format(user_name)):
        os.makedirs('./data/G_Graph2Vec_Data/{}/'.format(user_name))

    for st, uuid in enumerate(opcode_info):
        # 获得函数调用信息
        sample = opcode_info[uuid]
        sample_g = {
            'edges': [],
            'features': {}
        }
        for ci in range(0, len(sample), 2):
            # 构造映射：函数名->整数编号
            if sample[ci] not in node2id:
                node2id[sample[ci]] = len(node2id)
            if sample[ci + 1] not in node2id:
                node2id[sample[ci + 1]] = len(node2id)
            # 将原始数据集转换为二维格式
            sample_g['edges'].append([node2id[sample[ci]], node2id[sample[ci + 1]]])
            sample_g['features'][node2id[sample[ci]]] = func2type_idx(sample[ci])
            sample_g['features'][node2id[sample[ci + 1]]] = func2type_idx(sample[ci + 1])
            
        write_json(sample_g, './data/G_Graph2Vec_Data/{}/{}.json'.format(user_name, str(st)))



result_json = {}
# 切换数据级“DS1” “DS2” “DS3”

ds_name_list=['DS1','DS2','DS3','DS4']

for ds_name in ds_name_list:
#    make_data_graph2vec(ds_name)

    csv_result = read_csv_all(',', './data/G_Graph2Vec_Data/result/result_{}.csv'.format(ds_name))
    for cr in csv_result:
        result_json[int(cr[0])] = cr[1:]
        break

    x_t = []
    for ci in range(len(result_json)):
        x_t.append(result_json[ci])

    user_name = '{}_user_name'.format(ds_name)
    label_name = 'label_data_{}'.format(ds_name)
    label_info = read_json('./data/label_data/' + label_name + '.json')
    now_output_path = './data/user_name/' + user_name + '.json'
    opcode_info = read_json(now_output_path)
    uuid_list = []
    for uuid in opcode_info:
        uuid_list.append(uuid)

    import numpy as np

    x_t = np.array(x_t)
    index = np.random.permutation(len(x_t))
    x_t = x_t[index]
    uuid_list = np.array(uuid_list)[index]

    t_clustering(x_t, label_info=label_info, uuid_list=uuid_list)

