import warnings
warnings.filterwarnings('ignore')


import numpy

from util import read_json, read_csv_all, write_json, write_csv
from s_util import add_msv_periodicity, get_sentence_vec_1, get_sentence_vec_2, get_sentence_vec_3, t_clustering
import torch
from torch import nn
from torch.nn import Module, CrossEntropyLoss
from torch.optim import SGD
import os
import random
import numpy as np
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
import sys
from config import all_func, idx2type, mor_list
from s_util import get_public_data, get_word_mask, get_corpus
from matplotlib import pyplot as plt
from util import read_json, write_csv, read_csv_all, write_json
from s_util import add_msv_periodicity, de_pattern3
from collections import defaultdict
import math
import operator


def get_negative_sample(x, word_range, neg_num):
    """
    负采样
    :param x:
    :param word_range:
    :param neg_num:
    :return:
    """
    negs = []
    while True:
        rand = random.randrange(0, word_range)
        if rand not in negs and rand != x:
            negs.append(rand)
        if len(negs) == neg_num:
            return negs


def data_generator(corpus, word2id, id2word):
    """
    生成训练数据
    :return:
    """
    x, y, mor, mor_mask = [], [], [], []
    print('生成训练数据')
    sentence = corpus
    sentence = ([0] * window + [word2id[w] for w in sentence if w in word2id] + [0] * window)
    # 上面这句代码的意思是，因为我们是通过滑窗的方式来获取训练数据的，那么每一句语料的第一个词和最后一个词
    # 如何出现在中心位置呢？答案就是给它padding一下，例如“我/喜欢/足球”，两边分别补窗口大小个pad，得到“pad pad 我 喜欢 足球 pad pad”
    # 那么第一条训练数据的背景词就是['pad', 'pad','喜欢', '足球']，中心词就是'我'
    cc = 0
    for i in range(window, len(sentence) - window):
        cc += 1
        sys.stdout.write('\r' + str(cc / len(corpus)) + '%')
        # window: 窗口大小，一般为2 上述例子： range(2, 5)
        x.append(sentence[i - window:i] + sentence[i + 1:window + i + 1])
        # 第一遍遍历 x： ['pad', 'pad','喜欢', '足球'] 对应的idx
        y.append([sentence[i]] + get_negative_sample(sentence[i], len(id2word), nb_negative))  # negative_sample
        # 第一遍遍历： y : ?
        mor.append([])
        #  x[len(x) - 1] ： ['pad', 'pad','喜欢', '足球'] 对应的idx
        for idx in x[len(x) - 1]:
            # 为区分开词缀和单词， 词缀编号从idx + len(id2word)开始
            mor[len(mor) - 1] += [idx + len(id2word) for idx in word_map[id2word[str(idx)]]]
        mor_mask.append([])
        for idx in x[len(x) - 1]:
            mor_mask[len(mor) - 1] += mor_mask_dict[id2word[str(idx)]]

    print('\ndata_num: ', len(x))
    x, y, mor, mor_mask = np.array(x, dtype='int32'), np.array(y, dtype='int32'), np.array(mor, dtype='int32'), np.array(mor_mask, dtype='int32')
    z = np.zeros((len(x), nb_negative + 1))
    z[:, 0] = 1  # z是啥
    return x, y, z, mor, mor_mask


def get_train_test_data(x, y, z):
    X_train, X_test, y_train, y_test, z_train, z_test = train_test_split([x, y, z], test_size=0.2, random_state=42,
                                                                         shuffle=True)
    return X_train, X_test, y_train, y_test, z_train, z_test


# 准备成pytorch的DataLoader格式，方便训练
class DatasetTorch(Dataset):
    def __init__(self, x, y, z, mor, mor_mask):
        self.x = x
        self.y = y
        self.z = z[:, 1]  # torch使用交叉熵损失时，target不需要使用onehot
        self.mor = mor
        self.mor_mask = mor_mask

    def __len__(self):
        return self.x.shape[0]

    def __getitem__(self, index):
        return self.x[index], self.y[index], self.z[index], self.mor[index], self.mor_mask[index]


# 划分训练和测试数据
def get_train_test_dataloader(x, y, z, mor, mor_mask, batch_size):
    x_train, x_test, y_train, y_test, z_train, z_test, mor_train, mor_test, mor_mask_train, mor_mask_test = train_test_split(
        x, y, z, mor, mor_mask, test_size=0.2, random_state=42, shuffle=True)
    train_dataset = DatasetTorch(x_train, y_train, z_train, mor_train, mor_mask_train)
    test_dataset = DatasetTorch(x_test, y_test, z_test, mor_test, mor_mask_test)
    train_dataloader = DataLoader(train_dataset, batch_size=batch_size)
    test_dataloader = DataLoader(test_dataset, batch_size=batch_size)
    return train_dataloader, test_dataloader


class Word2VecCBOW(Module):
    def __init__(self, window, id2word, nb_negative, embedding_dim, max_mor):
        super(Word2VecCBOW, self).__init__()
        # 由于词缀和单词共有一个embedding， num_embeddings=单词数量 + 词缀数量 +
        self.embedding = nn.Embedding(num_embeddings=len(id2word) + len(mor2idx) + 1, embedding_dim=embedding_dim)
        # self.embedding2 = nn.Embedding(num_embeddings=len(id2word) + len(mor_to_idx) + 1, embedding_dim=embedding_dim)
        self.window = window
        self.id2word = id2word
        self.nb_negative = nb_negative
        self.embedding_dim = embedding_dim
        self.max_mor = max_mor

    def forward(self, input_words, negative_samples, mor_words, mor_mask):
        input_vecs = self.embedding(input_words)  # shape=(,window*2,word_size)
        mor_vecs = self.embedding(mor_words)
        mor_vecs = mor_vecs.view(input_vecs.size()[0], 2 * self.window, self.max_mor, -1)
        mor_mask = mor_mask.view(input_vecs.size()[0], 2 * self.window, self.max_mor, -1)

        mor_vecs_sum = torch.sum(mor_vecs * mor_mask, dim=2) / self.max_mor
        input_vecs = torch.add(input_vecs * lambda_for_mor, mor_vecs_sum * (1 - lambda_for_mor))  # 加入参数lambda
        input_vecs_sum = torch.sum(input_vecs, dim=1)  # CBOW模型直接对上下文单词的嵌入进行求和操作 shape=(,word_size)
        negative_sample_vecs = self.embedding(negative_samples)  # shape=(,nb_negative + 1,word_size)

        out = torch.matmul(negative_sample_vecs, torch.unsqueeze(input_vecs_sum, dim=2))
        out = torch.squeeze(out)
        out = torch.softmax(out, dim=-1)
        return out


def train(model, train_dataloader, device, optimizer, crossEntropyLoss):
    model.train()
    train_loss = 0.0
    for i, data in enumerate(train_dataloader):
        x_train, y_train, z_train, mor_train, mor_mask_train = data
        mor_train.to(torch.long).to(device)
        x_train, y_train, z_train, mor_train, mor_mask_train = x_train.to(device), y_train.to(
            torch.long).to(device), z_train.to(torch.long).to(device), mor_train.to(torch.long).to(
            device), mor_mask_train.to(torch.long).to(device)

        optimizer.zero_grad()  # 梯度清零
        z_predict = model(x_train, y_train, mor_train, mor_mask_train)  # (batch_size,51)
        loss = crossEntropyLoss(z_predict, z_train)  # z是将n分类问题转换为m分类问题  n>>m
        loss.backward()  # 梯度反向传播
        optimizer.step()  # 梯度更新
        train_loss += loss.item()
        # if i % 10 == 0:
        #     print(loss.item())
    return train_loss / i


def test(model, test_dataloader, device, crossEntropyLoss):
    model.eval()
    test_loss = 0.0
    for i, data in enumerate(test_dataloader):
        x_test, y_test, z_test, mor_train, mor_mask_train = data
        x_test, y_test, z_test, mor_train, mor_mask_train = x_test.to(torch.long).to(device), y_test.to(torch.long).to(
            device), z_test.to(torch.long).to(device), mor_train.to(torch.long).to(device), mor_mask_train.to(
            torch.long).to(device)
        z_predict = model(x_test, y_test, mor_train, mor_mask_train)  # (batch_size,51)
        loss = crossEntropyLoss(z_predict, z_test)
        test_loss += loss.item()

    return test_loss / i


def train_test(epochs, batch_size):
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    x, y, z, mor, mor_mask = data_generator(corpus, word2id, id2word)
    print(x.shape, y.shape, z.shape, mor.shape, mor_mask.shape)
    print('x:', x[0])
    print('y:', y[0])
    print('z:', z[0])
    print('mor:', mor[0])
    # print('mor_mask:', mor_mask[0])
    train_dataloader, test_dataloader = get_train_test_dataloader(x, y, z, mor, mor_mask, batch_size=batch_size)
    loss_fun = CrossEntropyLoss()
    cbow.to(device)
    optimizer = SGD(cbow.parameters(), lr=0.5)

    print("------开始训练------:", device)
    for epoch in range(1, epochs + 1):
        train_loss = train(cbow, train_dataloader, device, optimizer, loss_fun)
        test_loss = test(cbow, test_dataloader, device, loss_fun)
        print("epoch %d, train loss: %.2f, test loss:%.2f" % (epoch, train_loss, test_loss))

    write_json(word2id, now_output_path + 'word2id.json')
    torch.save(cbow, "./data/S_CBOW_Data/models/" + user_name + ".pkl")


def feature_select(dataset):
    # 总词频统计
    doc_frequency = defaultdict(int) #记录每个词出现的次数，可以把它理解成一个可变长度的list，只要你索引它，它就自动扩列
    for file in dataset:
        for word in file:
            doc_frequency[word] += 1
    # 计算每个词的TF值
    word_tf = {}  # 存储没个词的tf值
    for i in doc_frequency:
        word_tf[i] = doc_frequency[i] / sum(doc_frequency.values()) #sum(doc.frequency.values)

    # 计算每个词的IDF值
    doc_num = len(dataset)
    word_idf = {}  # 存储每个词的idf值
    word_doc = defaultdict(int)  # 存储包含该词的文档数
    for word in doc_frequency:
        for file in dataset:
            if word in file:
                word_doc[word] += 1
    #word_doc和doc_frequency的区别是word_doc存储的是包含这个词的文档数，即如果一个文档里有重复出现一个词则word_doc < doc_frequency
    for word in doc_frequency:
        word_idf[word] = math.log(doc_num / (word_doc[word] + 1))

    # 计算每个词的TF*IDF的值
    word_tf_idf = {}
    for word in doc_frequency:
        word_tf_idf[word] = word_tf[word] * word_idf[word]

    # 对字典按值由大到小排序
    dict_feature_select = sorted(word_tf_idf.items(), key=operator.itemgetter(1), reverse=True)
    return dict_feature_select


if __name__ == '__main__':
    word_size = 128  # 词向量维度
    seq_len = 100
    sentence_vec_len = word_size * seq_len  # 句向量维度
    window = 2  # 窗口大小
    nb_negative = 25  # 随机负采样的样本数
    min_count = 1  # 频数少于min_count的词会将被抛弃，低频词类似于噪声，可以抛弃掉
    file_num = 10000  # 只取file_num个文件进行训练
    mor_num = len([x.lower() for x in list(set(mor_list))]) + 1   # 词缀个数 加PMD
    nb_epoch = 100  # 迭代次数
    lambda_for_mor = 0.5  # a*单词 + （1-a）* 词素   lambda从0-1
    max_mor = 6


    user2uuid = ['DS1', 'DS2', 'DS3', 'DS4']

    for user in user2uuid:
        user_name = user+'_user_name'
        now_output_path = './data/S_CBOW_Data/mor-data/' + user_name + '/'
        if not os.path.exists(now_output_path):
            os.makedirs(now_output_path)

        # 聚类
        if os.path.isfile(now_output_path + 'word2vec_' + str(nb_epoch) + 'epoch_' + str(word_size) + '.json'):
            opcode2vector = read_json(now_output_path + 'word2vec_' + str(nb_epoch) + 'epoch_' + str(word_size) + '.json')
            sample_d = read_json('./data/user_name/'+user_name + '.json')
            sample_d_a = read_json('./data/S_CBOW_Data/public/sample_add_mor.json')
            opcode_info = {s_uuid: sample_d_a[s_uuid] for s_uuid in sample_d}
            opcode_info_lower = {s_uuid: [func.lower() for func in sample_d_a[s_uuid]] for s_uuid in sample_d}

            uuid_list = list()
            for uuid in opcode_info:
                uuid_list.append(uuid)

            label_info = read_json('./data/label_data/label_data_' + user.split('_user')[0] + '.json')
            uuid_list_1, x_concat = get_sentence_vec_1(opcode2vector, opcode_info_lower, seq_len)
            uuid_list_2, x_avg = get_sentence_vec_2(opcode2vector, opcode_info_lower)
            uuid_list_3, x_avg_tf_idf = get_sentence_vec_3(opcode2vector, opcode_info_lower)

            print('1.concat')
            t_clustering(x_concat, label_info, uuid_list_1)
            print('2.avg')
            t_clustering(x_avg, label_info, uuid_list_2)
            print('3.avg+tfidf')
            t_clustering(x_avg_tf_idf, label_info, uuid_list_3)


        # 训练词向量
        else:
            # 准备词缀数据
            input_file = read_json('./data/user_name/' + user_name + '.json')
            word_map = read_json('./data/S_CBOW_Data/public/word_map.json')
            mor_mask_dict = read_json('./data/S_CBOW_Data/public/mor_mask.json')
            mor2idx = read_json('./data/S_CBOW_Data/public/mor2idx.json')
            id2word = read_json('./data/S_CBOW_Data/public/idx2letter.json')
            word2id = read_json('./data/S_CBOW_Data/public/letter2idx.json')
            corpus = get_corpus(input_file, seq_len)
            print('user: ' + user_name)

            cbow = torch.load("./data/S_CBOW_Data/models/pretrain.pkl")
            train_test(nb_epoch, 256)  # 训练、测试

            # print(cbow.embedding.weight.shape)  # 提取训练好的Embedding
            W = cbow.embedding.weight.cpu().detach().numpy()
            word2idx = read_json(now_output_path + 'word2id.json')
            word_2_vec = dict()
            for word in word2idx:
                word_2_vec[word.lower()] = W[word2idx[word], :].tolist()

            write_json(word_2_vec, now_output_path + 'word2vec_' + str(nb_epoch) + 'epoch_' + str(word_size) + '.json')
