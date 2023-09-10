const initState=[]
export default function csvsReducer(preState=initState,action){
    const {type,data}=action
    let index;
    switch(type){
        case 'updateCsvs':
            return data;
        case 'shiftCsvs':
            //替换一条csv,data是Md5
            index=preState.findIndex((item)=>data===item[0]);
            // preState[index]['']='S';
            console.log("csvsReducer: ",preState[index])
            return preState;
        case 'changeCsvsItem':
            index=preState.findIndex((item)=>data.md5===item[0]);
            preState[index]['label']=data.label;
            return [...preState];
        case 'clearCsvs':
            return initState;
        default:
            return preState
    }
}