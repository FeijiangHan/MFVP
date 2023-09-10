/*
存储此轮训练的所有md5：md5Set
存储当前页面的md5：currentMd5
*/

const initState={
    currentId: 0,
    currentMd5: [],
    md5Set: [[]],
};

export default function newActionsReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        // 初始时设置
        case 'setTreesMd5':
            // console.log('setTreesMd5: ',data[0])
            //console.log('setTreesMd52: ',data)
            return {
                currentId: 0,
                currentMd5: data[0],
                md5Set: data,
            }
        case 'nextTreesMd5':
            if (preState.currentId === preState.md5Set.length-1)
            {
                return preState;
            }
            // console.log('currentMd5: ',preState.md5Set[preState.currentId+1])
            return {
                currentId: preState.currentId+1,
                currentMd5: preState.md5Set[preState.currentId+1],
                md5Set: preState.md5Set,
            };
        case 'prevTreesMd5':
            if (preState.currentId === 0) {
                return preState;
            }
            // console.log('currentMd5: ',preState.md5Set[preState.currentId-1])
            return {
                currentId: preState.currentId-1,
                currentMd5: preState.md5Set[preState.currentId-1],
                md5Set: preState.md5Set,
            };
        case 'clearTreesMd5':
            return initState;
        default:
            return preState;
    }
}