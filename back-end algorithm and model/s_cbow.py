# 导入需要的包
import warnings
warnings.filterwarnings("ignore")
import pandas as pd
import csv
from pprint import pprint
import gensim
from tqdm.notebook import tqdm
from util import read_json, t_clustering, write_json
from s_util import get_sentence_vec_1, get_sentence_vec_2, get_sentence_vec_3, make_data_sim

user_name_list = ['DS1', 'DS2', 'DS3',
                  'DS4']
label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']

vector_size = 128
min_count = 1
window = 2

for ci, user_name in enumerate(user_name_list):
    label_name = label_name_list[ci]
    now_output_path = './data/user_name/' + user_name + '_user_name.json'
    opcode_info = read_json(now_output_path)

    make_data_sim(user_name)

    # 训练模型
    model = gensim.models.Word2Vec(corpus_file="./data/S_CBOW_Data/S_CBOW_{}.txt".format(user_name),
                                   vector_size=vector_size, min_count=min_count, window=window)
    all_word = model.wv.key_to_index  # 1.获得所有词汇组
    # 得到词的向量
    word2vec = {word: model.wv[word].tolist() for word in all_word}
    write_json(word2vec, './data/S_GLOVE_Data/word2vec_' + user_name + '_' + str(vector_size) + '.json')

    word2vec = read_json('./data/S_GLOVE_Data/word2vec_' + user_name + '_' + str(vector_size) + '.json')
    # 构建句向量
    # 1.拼接
    uuid_1, X_1 = get_sentence_vec_1(word2vec, opcode_info, seq_len=100)
    # # 2.avg
    uuid_2, X_2 = get_sentence_vec_2(word2vec, opcode_info)
    # 3.avg + tfidf
    uuid_3, X_3 = get_sentence_vec_3(word2vec, opcode_info)


    label_info = read_json('./data/label_data/' + label_name + '.json')
    print('1.concat')
    t_clustering(X_1, label_info, uuid_1)
    print('2.avg')
    t_clustering(X_2, label_info, uuid_2)
    print('3.avg + tfidf')
    t_clustering(X_3, label_info, uuid_3)

