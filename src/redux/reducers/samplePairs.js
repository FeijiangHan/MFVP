import { deepCopy } from "../../assets/static/js/deepcopy";

const initState={
    current:[],
    history:[],
}


export default function samplePairsReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateCurrentSample':
            if (!data.length){
                return preState;
            }
            return {
                // 如果初始状态为空，则不放入
                current: data,
                history: preState.history,
            };
        case 'updateHistorySample':
            let preState_copy = deepCopy(preState);
            let history = [...preState_copy.current,...preState_copy.history];
            for (let i = 0; i < history.length; i++) {
                history[i].key = i;
            }
            return {
                current: [],
                history: history,
            };
        case 'clearSample':
            return {
                current: [],
                history: [],
            };
        default:
            return preState;
    }
}