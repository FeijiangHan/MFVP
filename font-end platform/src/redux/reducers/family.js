const initState=[]
export default function familyReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateFamily':
            return data;
        default:
            return preState
    }
}