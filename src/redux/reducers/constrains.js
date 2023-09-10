import { deepCopy } from "../../assets/static/js/deepcopy";

/*
* key - val
key：md5
value：约束、组别
*/
const initState = {}

export default function constrainsReducer(preState=initState,action){
    const {type,data}=action
    let copy_preState = deepCopy(preState)
    switch(type){
        // data： bool
        case 'UpdateIsSame':
            if (!preState.hasOwnProperty(data.id)) // 此pair不存在约束信息
            {
                copy_preState[data.id] = {
                    group1: data.group1,
                    group2: data.group2,
                    fileMD51: '',  // 第一个样本对中的样本1的fileMD5
                    fileMD52: '',  // 第一个样本对中的样本2的fileMD5
                    isSame: data.isSame,   // 该样本对中两个样本是否属于同一家族
                    similarSubgraph: [],
                    dissimilarSubgraph: [],
                }
                // console.log(copy_preState)
                return copy_preState;
            } else {
                copy_preState[data.id] = {
                    group1: data.group1,
                    group2: data.group2,
                    fileMD51: preState[data.id].fileMD51,  // 第一个样本对中的样本1的fileMD5
                    fileMD52: preState[data.id].fileMD52,  // 第一个样本对中的样本2的fileMD5
                    isSame: data.isSame,   // 该样本对中两个样本是否属于同一家族
                    similarSubgraph: preState[data.id].similarSubgraph,
                    dissimilarSubgraph: preState[data.id].dissimilarSubgraph,
                }
                // console.log(copy_preState)
                return copy_preState;
            }
             
        case 'UpdateSimilarSubgraph':
            console.log("preState: ",preState)
            if (!preState.hasOwnProperty(data.id)) // 此pair不存在约束信息
            {
                copy_preState[data.id] = {
                    group1: preState[data.id].group1,
                    group2: preState[data.id].group2,
                    fileMD51: data.fileMD51,  // 第一个样本对中的样本1的fileMD5
                    fileMD52: data.fileMD52,  // 第一个样本对中的样本2的fileMD5
                    isSame: 'init',   // 该样本对中两个样本是否属于同一家族
                    similarSubgraph: [data.similarSubgraph],
                    dissimilarSubgraph: [],
                }
                // console.log(copy_preState)
                return copy_preState;
            } else {
                copy_preState[data.id] = {
                    group1: preState[data.id].group1,
                    group2: preState[data.id].group2,
                    fileMD51: data.fileMD51,  // 第一个样本对中的样本1的fileMD5
                    fileMD52: data.fileMD52,  // 第一个样本对中的样本2的fileMD5
                    isSame: preState[data.id].isSame,   // 该样本对中两个样本是否属于同一家族
                    similarSubgraph: [...preState[data.id].similarSubgraph,data.similarSubgraph],
                    dissimilarSubgraph: preState[data.id].dissimilarSubgraph,
                    md5_subGraph: data.md5_subGraph,
                }
                return copy_preState;
            }
        case 'UpdateDissimilarSubgraph':
            if (!preState.hasOwnProperty(data.id)) // 此pair不存在约束信息
            {
                copy_preState[data.id] = {
                    group1: preState[data.id].group1,
                    group2: preState[data.id].group2,
                    fileMD51: data.fileMD51,  // 第一个样本对中的样本1的fileMD5
                    fileMD52: data.fileMD52,  // 第一个样本对中的样本2的fileMD5
                    isSame: 'init',   // 该样本对中两个样本是否属于同一家族
                    similarSubgraph: [],
                    dissimilarSubgraph: [data.dissimilarSubgraph],
                }
                // console.log(copy_preState)
                return copy_preState;
            } else {
                copy_preState[data.id] = {
                    group1: preState[data.id].group1,
                    group2: preState[data.id].group2,
                    fileMD51: data.fileMD51,  // 第一个样本对中的样本1的fileMD5
                    fileMD52: data.fileMD52,  // 第一个样本对中的样本2的fileMD5
                    isSame: preState[data.id].isSame,   // 该样本对中两个样本是否属于同一家族
                    similarSubgraph: preState[data.id].similarSubgraph,
                    dissimilarSubgraph: [data.dissimilarSubgraph,...preState[data.id].dissimilarSubgraph],
                }
                // console.log(copy_preState)
                return copy_preState;
            }
        case 'clearAllConstrains':
            return {};
        default:
            return preState;
    }
}