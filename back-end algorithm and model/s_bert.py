import warnings
warnings.filterwarnings("ignore")
import numpy as np

from util import read_json, write_json, t_clustering
from s_util import feature_select
import random


def random_dic(dicts):
    dict_key_ls = list(dicts.keys())
    random.shuffle(dict_key_ls)
    new_dic = {}
    for key in dict_key_ls:
        new_dic[key] = dicts.get(key)
    return new_dic


def make_corpus(user_name):
    now_output_path = './data/user_name/' + user_name + '.json'
    sample_info = read_json(now_output_path)
    sample_info = random_dic(sample_info)
    sample_list = [sample_info[uuid] for uuid in sample_info]
    corpus = ''

    for i in range(0, len(sample_list), 2):
        if i + 2 > len(sample_list):
            if len(sample_list) % 2 == 1:
                corpus += ' '.join(sample_list[i]) + ' ' + '\t' + ' ' + ' '.join(sample_list[0]) + '\n'
        else:
            corpus += ' '.join(sample_list[i]) + ' ' + '\t' + ' ' + ' '.join(sample_list[i + 1]) + '\n'

    with open('./data/S_BERT_Data/{}.txt'.format(user_name), 'w') as f:
        f.write(corpus)
    f.close()



def clustering_bert(user_name, label_name):
    from bert_pytorch.dataset import WordVocab
    import torch
    now_output_path = './data/user_name/' + user_name + '.json'
    sample_info = read_json(now_output_path)
    model = torch.load('./data/S_BERT_Data/model/bert_{}.model.ep9'.format(user_name))
    label_info = read_json('./data/label_data/' + label_name + '.json')

    concat_x_all = []
    avg_x_all = []
    cls_x_all = []
    uuid_list = []
    for uuid in sample_info:
        uuid_list.append(uuid)
        # 最大500长度
        seq_max = 500
        if len(sample_info[uuid]) > seq_max - 1:
            tokenized_text = ['[CLS]'] + sample_info[uuid][0: seq_max - 1]
        else:
            tokenized_text = ['[CLS]'] + sample_info[uuid]
        vocab = WordVocab.load_vocab('./data/S_BERT_Data/vocab_{}.small'.format(user_name))
        indexed_tokens = vocab.to_seq(tokenized_text)
        segments_ids = [1] * len(tokenized_text)

        # Convert inputs to PyTorch tensors
        tokens_tensor = torch.tensor([indexed_tokens])
        segments_tensors = torch.tensor([segments_ids])
        # print(tokens_tensor.size())
        # Put the model in "evaluation" mode, meaning feed-forward operation.
        model.eval()

        # Predict hidden states features for each layer
        with torch.no_grad():
            encoded_layers = model.forward(tokens_tensor, segments_tensors)  # 对应每一个词的向量，第一个词是cls

        # 1.concat
        concat_x = []
        if len(encoded_layers[0][1:]) > seq_len:
            for enc in encoded_layers[0][1:seq_len + 1]:
                concat_x.extend(np.array(enc))
        else:
            for enc in encoded_layers[0][1:]:
                concat_x.extend(np.array(enc))
            concat_x.extend([0]*((seq_len - len(encoded_layers[0][1:])) * hidden_size))

        concat_x_all.append(concat_x)

        assert len(concat_x) == len(concat_x_all[0])
        # 2.avg
        avg_x = np.zeros(hidden_size)
        for enc in encoded_layers[0][1:]:
            avg_x += np.array(enc)
        avg_x /= len(encoded_layers[0][1:])
        avg_x_all.append(avg_x)

        # 3.cls
        cls_x_all.append(np.array(encoded_layers[0][0]))

    print('1.concat')
    t_clustering(concat_x_all, label_info, uuid_list)
    print('2.avg')
    t_clustering(avg_x_all, label_info, uuid_list)
    print('3.Bert CLS')
    t_clustering(cls_x_all, label_info, uuid_list)


if __name__ == '__main__':

    user_name_list = ['DS1_user_name', 'DS2_user_name', 'DS3_user_name', 'DS4_user_name']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']
    seq_len = 100
    hidden_size = 128

    for ci, user_name in enumerate(user_name_list):
        label_name = label_name_list[ci]
        make_corpus(user_name)

        clustering_bert(user_name, label_name)
