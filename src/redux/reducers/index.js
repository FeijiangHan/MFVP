import {combineReducers} from 'redux';
import family from './family';
import sample from './sample'
import trees from './trees'
import csvs from './csvs'
import nextQuery from './next'

//-----------------------------------------
import treesMd5 from './treesMd5';
import training from './training';
import chart from './chart';
import samplePairs from './samplePairs';
import interactions from './interactions';
import constrains from './constrains';
import selectedNodes from './selectedNodes';
import iterations from './iterations';
import tableKey from './tableKey';
import historyCsvs from './historyCsvs';

export default combineReducers({
    family,sample,trees,csvs,nextQuery,
    treesMd5, // 当前显示树的md5
    training, // 训练参数
    chart, // 当前和历史的图表数据
    samplePairs, // 当前和历史的table数据集合
    interactions, // 添加约束的参数存储
    constrains, // 添加约束的参数存储
    selectedNodes, // 被选择的节点id和md5
    iterations, // 当前迭代轮数判断
    tableKey, // table项的key值
    historyCsvs, // 存储历史所有csvs数据，用于绘制历史散点图
})