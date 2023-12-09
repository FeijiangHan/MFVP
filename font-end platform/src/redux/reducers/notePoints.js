const initState={
    isSameFamily: false,
    md5:[],
    treeIds: [],
    md5_id: {}
}

export default function notePointsReducer(preState=initState,action){
    const {type,data}=action
    let stateCopy = JSON.parse(JSON.stringify(initState));
    switch(type){
        case 'notepoints':
            stateCopy.treeMd5 = data;
            return stateCopy;
        case 'addId':
            //console.log('adding state',data);
            if (!(data.md5 in initState.md5_id))
            {
                initState.md5_id[data.md5] = [data.id]
            }else if (!(data.id in initState.md5_id[data.md5])) {
                // console.log("加入： ",data.id)
                initState.md5_id[data.md5].push(data.id)
            }
            console.log('stateCopy',initState);
            return initState
        case 'isSameF':
            stateCopy.isSameFamily = true;
            return stateCopy;
        case 'clearMd5Id':
            initState.md5_id = [];
            return initState
        default:
            return [];
    }
}