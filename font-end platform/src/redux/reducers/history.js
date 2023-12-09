const initState=false;
export default function historyReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateHistShow':
            return data;
        default:
            return preState;
    }
}