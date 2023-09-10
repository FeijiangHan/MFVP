const initState=false;
export default function showReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateShow':
            return data;
        default:
            return preState;
    }
}