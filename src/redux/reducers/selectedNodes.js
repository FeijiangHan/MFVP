import { deepCopy } from "../../assets/static/js/deepcopy";

const initState={};

export default function selectedNodesReducer(preState=initState,action){
    const {type,data}=action
    let copy_preState = deepCopy(preState);
    switch(type){
        // 初始时设置
        case 'addNodes':
            if (!preState.hasOwnProperty(data.md5)) {
                copy_preState[data.md5] = [data.id];
            } else {
                copy_preState[data.md5].push(data.id);
            }
            return copy_preState;
        case 'removeNodes':
            copy_preState[data.md5] = copy_preState[data.md5].filter(id =>id !== data.id);
            return copy_preState;
        case 'clearNodes':
            return {};
        default:
            return preState;
    }
}