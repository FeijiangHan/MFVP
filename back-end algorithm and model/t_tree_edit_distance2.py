import warnings
warnings.filterwarnings("ignore")

from gklearn.utils import Dataset
import time
from gklearn.ged.env import GEDEnv
from util import read_json, write_json, t_clustering
import numpy as np


def get_matrix():
    # Predefined dataset name, use dataset "MUTAG".

    ds_name_list = ['tree_kernel_DS1', 'tree_kernel_DS2', 'tree_kernel_DS3', 'tree_kernel_DS4']
    user_name_list = ['DS1_user_name', 'DS2_user_name', 'DS3_user_name',
                      'DS4_user_name']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']

    for i in range(0,4):
        ds_name=ds_name_list[i]
        user_name=user_name_list[i]
        label_name=label_name_list[i]

        # Initialize a Dataset.
        dataset = Dataset()
        # Load predefined dataset "MUTAG".
        dataset.load_predefined_dataset(ds_name)

        # dataset.load_predefined_dataset(ds_name)
        # print(dataset.graphs[0])
        # assert 1 == 0
        ged_matrix = np.zeros((len(dataset.graphs), len(dataset.graphs)))
        ged_matrix[np.where(ged_matrix == 0)] = -1
        # 记录有没有计算

        same_graph_list = []

        for c1, graph1 in enumerate(dataset.graphs):
            t0 = time.time()
            for c2, graph2 in enumerate(dataset.graphs):

                # print(c2)
                # graph1 = dataset.graphs[95]
                # graph2 = dataset.graphs[96]

                if ged_matrix[c1][c2] != -1:
                    continue

                #print(graph1, graph2)

                """**2.  Compute graph edit distance.**"""
                ged_env = GEDEnv()  # initailize GED environment.
                ged_env.set_edit_cost('CONSTANT',  # GED cost type.o
                                      edit_cost_constants=[3, 3, 1, 3, 3, 1]
                                      # edit_cost_constants=[3, 3, 1, 3, 3, 1]  # edit costs.
                                      )

                ged_env.add_nx_graph(graph1, '')  # add graph1
                ged_env.add_nx_graph(graph2, '')  # add graph2
                listID = ged_env.get_all_graph_ids()  # get list IDs of graphs

                ged_env.init(init_type='LAZY_WITHOUT_SHUFFLED_COPIES')  # initialize GED environment.
                options = {'initialization_method': 'RANDOM',  # or 'NODE', etc.l
                           'threads': 4  # parallel threads.

                           # 'threads': 4  # parallel threads.
                           }
                ged_env.set_method('BIPARTITE',  # GED method. BIPARTITE
                                   options  # options for GED method.
                                   )
                ged_env.init_method()  # initialize GED method.
                ged_env.run_method(listID[0], listID[1])  # run.

                pi_forward = ged_env.get_forward_map(listID[0], listID[1])  # forward map.
                pi_backward = ged_env.get_backward_map(listID[0], listID[1])  # backward map.
                dis = ged_env.get_upper_bound(listID[0], listID[1])  # GED bewteen two graphs.

                #print(dis)
                ged_matrix[c1][c2] = dis
                ged_matrix[c2][c1] = dis

                # 更新same_graph_list
                if dis == 0:
                    is_in_set = False
                    for si, graph_set in enumerate(same_graph_list):
                        if c1 in graph_set:
                            same_graph_list[si].add(c2)
                            is_in_set = True
                            break
                    if not is_in_set:
                        same_graph_list.append({c1, c2})

                # 根据same_graph_list更新ged_matrix
                g_set = {}
                for graph_set in same_graph_list:
                    if c1 in graph_set:
                        g_set = graph_set
                        break
                for si in g_set:
                    ged_matrix[si][c2] = dis
                    ged_matrix[c2][si] = dis

            t1 = time.time()
            print(c1, ':', t1 - t0)

        write_json(ged_matrix.tolist(), './data/T_Tree_Data/edit/matrix_{}.json'.format(ds_name))





def clustering():

    ds_name_list = ['tree_kernel_DS1', 'tree_kernel_DS2', 'tree_kernel_DS3', 'tree_kernel_DS4']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']
    #ds_name_list = ['DS1', 'DS2', 'DS3', 'DS4']
    #label_name_list = ['new_system_1_DS1', 'new_system_1_DS2', 'new_system_1_DS3', 'new_system_1_DS4']

    for di in range(len(ds_name_list)):
        label_info = read_json('./data/label_data/' + label_name_list[di] + '.json')
        matrix_x = read_json('./data/T_Tree_Data/edit/matrix_{}.json'.format(ds_name_list[di]))
        uuid_list = []
        for uuid in label_info:
            uuid_list.append(uuid)

        # x_t = np.array(matrix_x)
        # index = np.random.permutation(len(x_t))
        # x_t = x_t[index]
        # uuid_list = np.array(uuid_list)[index]

        t_clustering(matrix_x, label_info, uuid_list)

#get_matrix()
clustering()




