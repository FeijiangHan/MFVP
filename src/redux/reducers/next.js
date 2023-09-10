const initState={
    treeMd5: [],
    isNext: false
}

export default function nextReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'next':
            let stateCopy = JSON.parse(JSON.stringify(initState));
            stateCopy.treeMd5 = data;
            stateCopy.true = true;
            // let time = new Date();
            // let second = time.getSeconds();
            // stateCopy.treeMd5.push({"label": second})
            return stateCopy;
        default:
            return [];
    }
}