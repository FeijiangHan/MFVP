const initState=1;

export default function iterationsReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'UpdateIterations':
            return preState+1;
        case 'ClearIterations':
            return initState;
        default:
            return preState;
    }
}