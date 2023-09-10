import { deepCopy } from "../../assets/static/js/deepcopy";

const initState={
};

export default function md5ConstrainsReducer(preState=initState,action){
    const {type,data}=action
    let copy_preState = deepCopy(preState);
    switch(type){
        case 'addMd5Constraints':
            // console.log("before: ",copy_preState)
            copy_preState[data.md5].push(data.constrain);
            // console.log("after: ",copy_preState)
            // if (copy_preState[data.md5] === undefined) {
            //     copy_preState[data.md5] = [data.constrain];
            //     console.log("not: ",copy_preState)
            // } else {
            //     console.log("before: ",copy_preState)
            //     copy_preState[data.md5].push(data.constrain);
            //     console.log("after: ",copy_preState)
            // }
            // if (!copy_preState.hasOwnProperty(data.md5)) {
            //     console.log("not: ",copy_preState)
            //     copy_preState[data.md5] = [data.constrains];
            // } else {
            //     console.log("before: ",copy_preState)
            //     copy_preState[data.md5].push(data.constrains);
            //     console.log("data.constrains: ",data.constrains)
            //     console.log("after: ",copy_preState)
            // }
            // const md5 = JSON.stringify(data.md5);
            // return {md5 : data.constrains,}

            // for (let i = 0; i < copy_preState.length; i++) {
            //     if (copy_preState[i] === data.md5) {
                    
            //     }
            // }
            // console.log("before: ",copy_preState)
            // copy_preState[data.md5] = [...preState[data.md5],data.constrains];
            // console.log("data.constrains: ",data.constrains)
            // console.log("after: ",copy_preState)
            // console.log("addMd5Constraints: ",copy_preState);
            return copy_preState;
        case 'clearNodes':
            return {};
        default:
            return preState;
    }
}