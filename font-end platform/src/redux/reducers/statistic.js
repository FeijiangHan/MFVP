const initState=[];
export default function statisticReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateStatistic':
            return data;
        default:
            return preState;
    }
}