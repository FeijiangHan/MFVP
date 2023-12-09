const initState={
    disabled: false,
    datasetName: "",
    queryStrategy: "",
    trainStrategy: "",
    round: 0,
    pairs: 0,
    DRMethod:"",
    clusterMethod: "",
}

export default function TrainingConfigReducer(preState=initState,action){
    switch(action.type){
        case 'updateTrainingConfig':
            return {
                disabled: false,
                datasetName: action.data.datasetName,
                queryStrategy: action.data.queryStrategy,
                trainStrategy: action.data.trainStrategy,
                round: action.data.numOfIterations,
                pairs: action.data.numOfSamplePairs,
                DRMethod: action.data.DRMethod,
                clusterMethod: action.data.clusterMethod,
            };
        case 'updateTrainingConfig_basic':
            return {
                disabled: false,
                datasetName: action.data.datasetName,
                queryStrategy: action.data.queryStrategy,
                trainStrategy: action.data.trainStrategy,
                round: action.data.numOfIterations,
                pairs: action.data.numOfSamplePairs,
                DRMethod: preState.DRMethod,
                clusterMethod: preState.clusterMethod,
            };
        case 'updateTrainingConfig_more':
            return {
                disabled: false,
                datasetName: preState.datasetName,
                queryStrategy: preState.queryStrategy,
                trainStrategy: preState.trainStrategy,
                round: preState.numOfIterations,
                pairs: preState.numOfSamplePairs,
                DRMethod: action.data.DRMethod,
                clusterMethod: action.data.clusterMethod,
            };
        case 'disabledInput':
            return {
                disabled: true,
                datasetName: preState.datasetName,
                queryStrategy: preState.queryStrategy,
                trainStrategy: preState.trainStrategy,
                round: preState.round,
                pairs: preState.pairs,
                DRMethod: preState.DRMethod,
                clusterMethod: preState.clusterMethod,
            }
        case 'ableInput':
            return {
                disabled: false,
                datasetName: preState.datasetName,
                queryStrategy: preState.queryStrategy,
                trainStrategy: preState.trainStrategy,
                round: preState.round,
                pairs: preState.pairs,
                DRMethod: preState.DRMethod,
                clusterMethod: preState.clusterMethod,
            }
        case 'ClearTraining':
            return initState;
        default:
            return preState;
    }
}