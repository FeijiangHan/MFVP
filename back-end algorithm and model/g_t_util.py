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

#将user_name数据处理为graph_data或tree_data
def get_graph_data(user_name, output_path, output_name):
    import os
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    sample_info = read_json('E:\\project\\malware-clustering\\data\\Seq_Data\\Ded_Augmented_Data_{}.json'.format(user_name))

    sentence = [[str(graph_idx + 1) + '|' + func for func in sample_info[uuid]] for graph_idx, uuid in
                enumerate(sample_info)]

    func_list = []
    for s in sentence:
        func_list.extend(s)

    func_unique = []
    for func in func_list:
        if func not in func_unique:
            func_unique.append(func)

    func2id = {func: idx + 1 for idx, func in enumerate(func_unique)}
    id2func = {idx + 1: func for idx, func in enumerate(func_unique)}

    ori_func_unique = []
    for o_f in [func.split('|')[1] for func in func_unique]:
        if o_f not in ori_func_unique:
            ori_func_unique.append(o_f)

    ori_func2id = {func: idx for idx, func in enumerate(ori_func_unique)}

    op_a = ''
    for seq in sentence:
        for idx in range(0, len(seq), 2):
            op_a += str(func2id[seq[idx]]) + ', ' + str(func2id[seq[idx + 1]]) + '\n'

    op_graph_indicator = ''
    for f_id in range(1, len(id2func) + 1):
        op_graph_indicator += id2func[f_id].split('|')[0] + '\n'

    op_edge_labels = ''
    for _ in range(len(op_a.split('\n')) - 1):
        op_edge_labels += '1\n'

    op_graph_labels = ''
    for _ in range(len(sentence)):
        op_graph_labels += '0\n'

    op_node_labels = ''
    for f_id in range(1, len(id2func) + 1):
        op_node_labels += str(ori_func2id[id2func[f_id].split('|')[1]]) + '\n'

    str_list = [op_a, op_edge_labels, op_graph_indicator, op_graph_labels, op_node_labels]
    for idx, file_name in enumerate(['{}_A.txt'.format(output_name), '{}_edge_labels.txt'.format(output_name),
                                     '{}_graph_indicator.txt'.format(output_name),
                                     '{}_graph_labels.txt'.format(output_name),
                                     '{}_node_labels.txt'.format(output_name)]):
        file_handle = open(output_path + file_name, mode='w')
        file_handle.write(str_list[idx])
        file_handle.close()


# output_name = 'DS1'
# user_name = 'new_system_1_{}_de_pattern_3'.format(output_name)
# get_graph_data(user_name, './data/G_Graph_Data/{}/'.format(output_name), output_name)


def get_tree_data(user_name, output_path, output_name):
    import os
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    sample_info = read_json('E:/project/malware-clustering/data/T_Tree_Data/Ori/new_system_1_{}.json'.format(user_name))

    sentence = [[str(graph_idx + 1) + '|' + func for func in sample_info[uuid]] for graph_idx, uuid in
                enumerate(sample_info)]

    func_list = []
    for s in sentence:
        func_list.extend(s)

    func_unique = []
    for func in func_list:
        if func not in func_unique:
            func_unique.append(func)

    func2id = {func: idx + 1 for idx, func in enumerate(func_unique)}
    id2func = {idx + 1: func for idx, func in enumerate(func_unique)}

    ori_func_unique = []
    for o_f in [func.split('|')[1] for func in func_unique]:
        if o_f not in ori_func_unique:
            ori_func_unique.append(o_f)

    ori_func2id = {func: idx for idx, func in enumerate(ori_func_unique)}

    op_a = ''
    for seq in sentence:
        for idx in range(0, len(seq), 2):
            op_a += str(func2id[seq[idx]]) + ', ' + str(func2id[seq[idx + 1]]) + '\n'

    op_graph_indicator = ''
    for f_id in range(1, len(id2func) + 1):
        op_graph_indicator += id2func[f_id].split('|')[0] + '\n'

    op_edge_labels = ''
    for _ in range(len(op_a.split('\n')) - 1):
        op_edge_labels += '1\n'

    op_graph_labels = ''
    for _ in range(len(sentence)):
        op_graph_labels += '0\n'

    op_node_labels = ''
    for f_id in range(1, len(id2func) + 1):
        op_node_labels += str(ori_func2id[id2func[f_id].split('|')[1]]) + '\n'

    str_list = [op_a, op_edge_labels, op_graph_indicator, op_graph_labels, op_node_labels]
    for idx, file_name in enumerate(['{}_A.txt'.format(output_name), '{}_edge_labels.txt'.format(output_name),
                                     '{}_graph_indicator.txt'.format(output_name),
                                     '{}_graph_labels.txt'.format(output_name),
                                     '{}_node_labels.txt'.format(output_name)]):
        file_handle = open(output_path + file_name, mode='w')
        file_handle.write(str_list[idx])
        file_handle.close()


# output_name = 'DS4'
# get_tree_data(output_name, './data/T_Tree_Data/{}/'.format(output_name), output_name)

