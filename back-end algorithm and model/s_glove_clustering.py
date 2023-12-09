from nltk.tokenize import word_tokenize
from torch.autograd import Variable
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.optim as optim
from util import read_json, write_json, t_clustering
from s_util import get_sentence_vec_1, get_sentence_vec_2, get_sentence_vec_3
import warnings
warnings.filterwarnings("ignore")

# 权重函数
def wf(x):
    if x < xmax:
        return (x / xmax) ** alpha
    return 1


# 产生批数据
def gen_batch():
    sample = np.random.choice(np.arange(len(coocs)), size=batch_size, replace=False)  # 从中选取batch_size条数据
    l_vecs, r_vecs, covals, l_v_bias, r_v_bias = [], [], [], [], []
    for chosen in sample:
        ind = tuple(coocs[chosen])  # 取出当前所选样本的坐标
        l_vecs.append(l_embed[ind[0]])
        r_vecs.append(r_embed[ind[1]])
        covals.append(comat[ind])
        l_v_bias.append(l_biases[ind[0]])
        r_v_bias.append(r_biases[ind[1]])
    return l_vecs, r_vecs, covals, l_v_bias, r_v_bias


if __name__ == '__main__':
    # 参数设置
    context_size = 3  # 设置窗口的大小
    embed_size = 128  # 词嵌入的维度
    xmax = 2
    alpha = 0.75  # 以上两个参数是定义权重函数是所需要的 可以自己随意设定
    batch_size = 512
    l_rate = 0.001
    num_epochs = 5
    seq_len = 100

    user_name_list = ['DS1', 'DS2', 'DS3','DS4']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']
    for ci, user_name in enumerate(user_name_list):
        label_name = label_name_list[ci]
        print('打开文件 读取语料')
        now_output_path = './data/user_name/' + user_name + '_user_name.json'
        opcode_info = read_json(now_output_path)
        word_list = []
        for uuid in opcode_info:
            word_list.extend(opcode_info[uuid])

        # fr = open('short_story.txt', 'r')
        # text = fr.read().lower()
        # fr.close()
        # print(text)
        # 建立词表
        # word_list = word_tokenize(text)   # 分词

        vocab = np.unique(word_list)  # 去重后的词表
        w_list_size = len(word_list)  # 语料中词的个数
        vocab_size = len(vocab)  # 词表的大小

        # 词到id的映射
        w_to_i = {word: ind for ind, word in enumerate(vocab)}
        # print(w_to_i)

        print('获得comat')

        # word_list: 原始sentence
        comat = np.zeros((vocab_size, vocab_size))   # 贡献概率矩阵
        for i in range(w_list_size):
            for j in range(1, context_size + 1):
                ind = w_to_i[word_list[i]]  # 将语料中每次词拿出来  转为id
                if i - j > 0:  # 找去窗口内的左边词汇id
                    lind = w_to_i[word_list[i - j]]
                    comat[ind, lind] += 1.0 / j  # 考虑的权重  你若越远 这个权重越低  你若越近 权重越高
                if i + j < w_list_size:  # 找去窗口内的左边词汇id
                    rlid = w_to_i[word_list[i + j]]
                    comat[ind, rlid] += 1.0 / j

        # np.nonzero()  输出为一个元组  第一个元组是非零元素所在的行  第二个元素是非零元素所在的列
        coocs = np.transpose(np.nonzero(comat))  # 现在 coocs的每一行就是非零元素所在的坐标

        # 设定词向量 和 偏置项
        l_embed, r_embed = [
            [Variable(torch.from_numpy(np.random.normal(0, 0.01, (embed_size, 1))),
                      requires_grad=True) for j in range(vocab_size)] for i in range(2)]

        l_biases, r_biases = [
            [Variable(torch.from_numpy(np.random.normal(0, 0.01, 1)),
                      requires_grad=True) for j in range(vocab_size)] for i in range(2)]

        # 设定优化器
        optimizer = optim.Adam(l_embed + r_embed + l_biases + r_biases, lr=l_rate)

        print('模型的训练')

        # 模型的训练
        for epoch in range(num_epochs):
            num_batches = int(w_list_size / batch_size)  # 看一下一批需去多少数据
            avg_loss = 0.0
            for batch in range(num_batches):
                optimizer.zero_grad()
                l_vecs, r_vecs, covals, l_v_bias, r_v_bias = gen_batch()
                # 定义损失函数
                # For pytorch v2 use, .view(-1) in torch.dot here. Otherwise, no need to use .view(-1).
                loss = sum([torch.mul((torch.dot(l_vecs[i].view(-1), r_vecs[i].view(-1))
                                       + l_v_bias[i] + r_v_bias[i] - np.log(covals[i])) ** 2, wf(covals[i])) for i in
                            range(batch_size)])

                avg_loss += loss.data[0] / num_batches
                loss.backward()  # 反向传播
                optimizer.step()
            print("per epoch average loss:" + str(epoch + 1) + ": ", avg_loss)

        word2vec = {}
        for word_ind in range(len(vocab)):
            w_embed = (l_embed[word_ind].data + r_embed[word_ind].data).numpy()
            word2vec[vocab[word_ind]] = [v[0] for v in w_embed]
        write_json(word2vec, './data/S_GLOVE_Data/word2vec_' + user_name + '.json')

        word2vec = read_json('./data/S_GLOVE_Data/word2vec_' + user_name + '.json')
        # 构建句向量
        # 1.拼接
        uuid_1, X_1 = get_sentence_vec_1(word2vec, opcode_info, seq_len=100)
        # 2.avg
        uuid_2, X_2 = get_sentence_vec_2(word2vec, opcode_info)
        # 3.avg + tfidf
        uuid_3, X_3 = get_sentence_vec_3(word2vec, opcode_info)

        label_info = read_json('./data/label_data/' + label_name + '.json')
        print('1.concat')
        t_clustering(X_1, label_info, uuid_1)
        print('2.avg')
        t_clustering(X_2, label_info, uuid_2)
        #write_json(np.array(X_2).tolist(), './data/S_GLOVE_Data/X_' + label_name + '.json')
        print('3.avg + tfidf')
        t_clustering(X_3, label_info, uuid_3)

# 使用词向量的优点
# 1.场景原因，函数名可能不存在多义性问题
# 2.对于该场景下，不需要微调，词向量固定，可以直接得到句向量？速度快  No 也可以微调
