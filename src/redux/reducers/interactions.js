const initState={
    must: false,
    cannot: false,
    similar: 0,
    unSimilar: 0,
};

export default function interactionsReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'UpdateInteractions':
            return data;
        default:
            return preState;
    }
}