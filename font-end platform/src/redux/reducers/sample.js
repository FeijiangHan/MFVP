const initState={}
export default function sampleReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateSample':
            return data;
        default:
            return preState;
    }
}