const initState= {
    current: {round: -1,tableData:[],csvs:[],dataNum:0,labelNum:0,outLiers:0,normalNum:0},
    history: [],
};

export default function historyChartReducer(preState=initState,action){
    const {type,data}=action
    switch(type){
        case 'updateHistoryChart':
            return {
                // current: {round: preState.current.round,tableData:[],csvs:[],dataNum:0,labelNum:0,outLiers:0,normalNum:0},
                current: preState.current,
                history: [preState.current,...preState.history],
            };
        case 'updateCurrentChart':
            return {
                current: {
                    round: preState.current.round + 1,
                    tableData: data.tableData,
                    csvs: data.csvs,
                    dataNum: data.dataNum,
                    labelNum: data.labelNum,
                    outLiers: data.outLiers,
                    normalNum: data.normalNum,
                },
                history: preState.history,
            };
        case 'clearChart':
            return initState;
        default:
            return preState;
    }
}