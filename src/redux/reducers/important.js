const initState=[];
export default function importantReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateImportant':
            return data;
        default:
            return preState;
    }
}