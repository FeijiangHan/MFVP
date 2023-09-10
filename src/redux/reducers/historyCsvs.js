const initState=[];
export default function historyCsvsReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateHistoryCsvs':
            return [...preState, data];
        case 'clearHistoryCsvs':
            return initState;
        default:
            return preState;
    }
}