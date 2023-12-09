import warnings
warnings.filterwarnings("ignore")

"""**1.   Get dataset.**"""

from gklearn.utils import Dataset
from util import write_json, t_clustering, read_json


def graph_kernel_clu(ds_name, label_info, uuid_list):
    dataset = Dataset()

    dataset.load_predefined_dataset(ds_name)
    len(dataset.graphs)
    print(len(dataset.graphs))

    """**2.  Compute graph kernel.**"""

    from gklearn.kernels import PathUpToH, CommonWalk, WeisfeilerLehman

    kernel_options = {}


    graph_kernel = WeisfeilerLehman(node_labels=dataset.node_labels,  # list of node label names.
                                edge_labels=dataset.edge_labels,  # list of edge label names.
                                ds_infos=dataset.get_dataset_infos(keys=['directed']),
                                # dataset information required for computation.
                                **kernel_options,  # options for computation.
                                )

    print('done.')

    gram_matrix, run_time = graph_kernel.compute(dataset.graphs,
                                                 parallel=None,  # or None or imap_unordered.
                                                 n_jobs=1,  # number of parallel jobs.
                                                 normalize=True,  # whether to return normalized Gram matrix.
                                                 verbose=2  # whether to print out results.
                                                 )
    # Print results.
    print()
    print(run_time)

    write_json(gram_matrix.tolist(), './data/G_Graph_Data/kernel/{}_{}.json'.format('tmp', ds_name))

    import numpy as np
    x_t = np.array(gram_matrix)
    print(np.shape(x_t))
    index = np.random.permutation(len(x_t))
    x_t = x_t[index]
    uuid_list = np.array(uuid_list)[index]
    t_clustering(x_t, label_info, uuid_list)


if __name__ == '__main__':

    ds_name_list = ['graph_kernel_DS1', 'graph_kernel_DS2', 'graph_kernel_DS3', 'graph_kernel_DS4']
    user_name_list = ['DS1_user_name', 'DS2_user_name', 'DS3_user_name',
                      'DS4_user_name']
    label_name_list = ['label_data_DS1', 'label_data_DS2', 'label_data_DS3', 'label_data_DS4']
    for ci, user_name in enumerate(user_name_list):
        label_name = label_name_list[ci]
        d_ds_name = ds_name_list[ci]
        print(d_ds_name)
        print('打开文件 读取语料')
        now_output_path = './data/user_name/' + user_name + '.json'

        #该处为了得到名称
        opcode_info = read_json(now_output_path)
        uuid_list = []
        for uuid in opcode_info:
            uuid_list.append(uuid)

        print(len(uuid_list))

        #该部分为了得到编号
        label_info = read_json('./data/label_data/' + label_name + '.json')
        graph_kernel_clu(d_ds_name, label_info, uuid_list)
