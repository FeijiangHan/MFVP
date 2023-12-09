import warnings
warnings.filterwarnings("ignore")

from util import read_json, t_clustering



for tree_type in [ 'common_tree', 'old_tree', 'not_common_tree']:

    for ds_name in ['DS1','DS2','DS3','DS4']:

        user_name = '{}_user_name'.format(ds_name)
        label_name = 'label_data_{}'.format(ds_name)

        now_output_path = './data/user_name/' + user_name + '.json'
        opcode_info = read_json(now_output_path)
        label_info = read_json('./data/label_data/' + label_name + '.json')

        uuid_list = []
        for uuid in opcode_info:
            uuid_list.append(uuid)

        similar_matrix = read_json('./data/T_Tree_Data/edit/matrix_{}_user_name_{}.json'.format(ds_name, tree_type))

        x_t = []
        max_s = 0
        for uuid1 in uuid_list:
            x_t.append([])
            for uuid2 in uuid_list:
                if uuid1 + '#' + uuid2 in similar_matrix:
                    x_t[len(x_t) - 1].append(similar_matrix[uuid1 + '#' + uuid2])
                    if similar_matrix[uuid1 + '#' + uuid2] > max_s:
                        max_s = similar_matrix[uuid1 + '#' + uuid2]
                else:
                    x_t[len(x_t) - 1].append(similar_matrix[uuid2 + '#' + uuid1])
                    if similar_matrix[uuid2 + '#' + uuid1] > max_s:
                        max_s = similar_matrix[uuid2 + '#' + uuid1]

        for ci in range(len(x_t)):
            for vi in range(len(x_t[ci])):
                x_t[ci][vi] = 1 - x_t[ci][vi] / max_s

        print(tree_type)
        t_clustering(x_t, label_info, uuid_list)




