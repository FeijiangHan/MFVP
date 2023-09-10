const initState=[]
export default function treesReducer(preState=initState,action){
    const {type,data}=action;
    switch(type){
        case 'addTree':
            let newData=[data,...preState]
            if(preState.length>=5){
                return newData.slice(0,5);
            }
            return newData;
        default:
            return preState;
    }

}