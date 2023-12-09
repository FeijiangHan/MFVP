"""
Graph Clustering Evaluation
Copyright 2023 Example Author author@email.com
This module provides tools for evaluating graph clustering algorithms. It
implements functions for data preprocessing, clustering models, metric
calculation, and visualization.

The core functionality includes:
1. Input/output functions for reading and writing csv/json data formats
2. Dimensionality reduction using PCA+t-SNE
3. K-means and Mean Shift clustering algorithms
4. Accuracy and NMI metrics calculation
5. Results plotting

The workflow is:
1. Load graph data
2. Preprocess - dimensionality reduction
3. Cluster using different models
4. Evaluateclustering quality with metrics
5. Visualize results
This provides a reproducible framework for benchmarking and comparing graph
clustering algorithms.
"""

from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
import json
from collections import defaultdict
import math
import operator
import matplotlib
from sklearn import metrics
from scipy.optimize import linear_sum_assignment
matplotlib.use('TkAgg')


# 读取csv文件所有列
def read_csv_all(sep, path, header=True) -> object:
    if header:
        df = pd.read_csv(path, sep=sep)
        data_csv = df.iloc[:, 0:df.shape[1]].values
    else:
        df = pd.read_csv(path, sep=sep, header=None)
        data_csv = df.iloc[:, 0:df.shape[1]].values
    return data_csv


# 根据索引列读取csv文件
def read_csv_by_index(sep, path, index, header=True):
    if header:
        df = pd.read_csv(path, usecols=index, sep=sep)
        data_csv = df.iloc[:, 0:len(index)].values
    else:
        df = pd.read_csv(path, usecols=index, sep=sep, header=None)
        data_csv = df.iloc[:, 0:len(index)].values
    return data_csv


# 写入csv文件
def write_csv(data, name, path, sep=','):
    result = pd.DataFrame(columns=name, data=data)
    result.to_csv(path, index=False, sep=sep)


# 保持为.json格式
def write_json(datas, path):
    json_data = json.dumps(datas)
    file_object = open(path, 'w')
    file_object.write(json_data)
    file_object.close()


def read_json(path):
    with open(path, 'r', encoding='utf8') as fp:
        json_data = json.load(fp)
    return json_data

def acc(y_true, y_pred):
    """
    Calculate clustering accuracy. Require scikit-learn installed
    # Arguments
        y_true: true labels, numpy.array with shape `(n_samples,)`
        y_pred: predicted labels, numpy.array with shape `(n_samples,)`
    # Return
        accuracy, in [0,1]
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_true = y_true.astype(np.int64)
    assert y_pred.size == y_true.size
    D = max(y_pred.max(), y_true.max()) + 1
    w = np.zeros((D, D), dtype=np.int64)
    for i in range(y_pred.size):
        w[y_pred[i], y_true[i]] += 1
    ind = linear_sum_assignment(w.max() - w)
    ind = np.array(ind).T
    return sum([w[i, j] for i, j in ind]) * 1.0 / y_pred.size


def cal_acc_and_nmi(label_list, pre_list):
    acc_r = acc(label_list, pre_list)
    nmi_r = metrics.normalized_mutual_info_score(label_list, pre_list)
    return acc_r, nmi_r

def t_clustering(X, label_info, uuid_list):
    from sklearn.decomposition import PCA
    from sklearn.manifold import TSNE

    data_pca = PCA(n_components=100, random_state=100).fit_transform(np.array(X, dtype=np.float32))
    data_pca_tsne = TSNE(n_components=2, init='pca', random_state=100).fit_transform(data_pca)

    x_data = []
    y_data = []
    for d in data_pca_tsne:
        x_data.append(d[0])
        y_data.append(d[1])

    family_num = dict()
    for uuid in label_info:
        family_num[label_info[uuid]] = 0

    # # 设置半径，最小样本量，建模
    # db = DBSCAN(eps=20, min_samples=3).fit(data_pca_tsne)
    # labels = db.labels_

    from sklearn.cluster import KMeans
    #from get_acc_nmi import cal_acc_and_nmi
    epoch_num = 10  # 10次取平均值
    labels = []
    acc_nmi_result = [0, 0, 0, 0]
    for step in range(epoch_num):
        clf = KMeans(n_clusters=len(family_num) - 1)
        db = clf.fit(X)
        labels = db.labels_
        ground_truth = []
        for uuid in uuid_list:
            ground_truth.append(label_info[uuid])

        import sklearn.cluster as sc
        # 基于MeanShift完成聚类
        bw = sc.estimate_bandwidth(data_pca_tsne, n_samples=len(X), quantile=0.1)
        model = sc.MeanShift(bandwidth=bw, bin_seeding=False)
        model.fit(data_pca_tsne)  # 完成聚类
        mean_shift_labels = model.predict(data_pca_tsne)  # 预测点在哪个聚类中

        kmeans_acc, kmeans_nmi = cal_acc_and_nmi(ground_truth, labels)
        gmm_acc, gmm_nmi = cal_acc_and_nmi(ground_truth, mean_shift_labels)
        acc_nmi_result[0] += kmeans_acc
        acc_nmi_result[1] += kmeans_nmi
        acc_nmi_result[2] += gmm_acc
        acc_nmi_result[3] += gmm_nmi

    print('kmeans:', acc_nmi_result[0]/epoch_num, acc_nmi_result[1]/epoch_num)
    print('mean-shift:', acc_nmi_result[2]/epoch_num, acc_nmi_result[3]/epoch_num)
    # 可视化降维后结果
    plt.scatter(x_data, y_data, s=2, c=mean_shift_labels)
    plt.show()














