const initState=0;
export default function tableKeyReducer(preState=initState,action){
    switch(action.type){
        case 'addKey':
            return preState+action.data;
        default:
            return preState;
    }
}