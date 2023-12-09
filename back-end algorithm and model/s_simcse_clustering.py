from util import read_json, t_clustering
import warnings
warnings.filterwarnings("ignore")



# def make_data_sim():
#     sample_info = read_json(
#         'C:\\Users\\MyPC\\202111-malware-clustering\\new-data\\Seq\\Ded_Augmented_Data_new_system_1_DS4_de_pattern_3.json')
#     sample_list = [sample_info[uuid] for uuid in sample_info]
#     corpus = ''
#
#     for i in range(len(sample_list)):
#         corpus += ' '.join(sample_list[i]) + '\n'
#
#     with open('./data/simcse/corpus.txt', 'w') as f:
#         f.write(corpus)
#     f.close()


if __name__ == '__main__':
    user_name_list = ['DS1_user_name', 'DS2_user_name', 'DS3_user_name', 'DS4_user_name']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']
    for ci, user_name in enumerate(user_name_list):
        label_name = label_name_list[ci]
        print('打开文件 读取语料')
        now_output_path = './data/user_name/' + user_name + '.json'
        opcode_info = read_json(now_output_path)
        uuid_list = []
        for uuid in opcode_info:
            uuid_list.append(uuid)

        # 构建句向量
        # 1.拼接
        X_1 = read_json('./data/S_SIMCSE_Data/concat_{}.json'.format(user_name))
        # 2.avg
        X_2 = read_json('./data/S_SIMCSE_Data/avg_{}.json'.format(user_name))
        # 3.avg + tfidf
        X_3 = read_json('./data/S_SIMCSE_Data/cls_{}.json'.format(user_name))

        label_info = read_json('./data/label_data/' + label_name + '.json')
        print('1.concat')
        t_clustering(X_1, label_info, uuid_list)
        print('2.avg')
        t_clustering(X_2, label_info, uuid_list)
        print('3.simCSE cls')
        import numpy as np
        t_clustering(np.array(X_3).squeeze(axis=1), label_info, uuid_list)

