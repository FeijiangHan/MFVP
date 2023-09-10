import { Button, Message } from '@arco-design/web-react';
import './FCTreePairVis.css';
import {React, useState,useEffect, useCallback, useRef} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { getFCtree, getNextQuery, gets_cluster, upDataPairwiseConstraints } from '../../network/request';
import { GridTreeNew } from '../../assets/static/js/gridTreeNew';
import * as d3 from 'd3';
import { setTreesMd5 } from '../../redux/action/treesMd5';
import {IconStorage} from '@arco-design/web-react/icon';
import { CaretDownOutlined, CaretUpOutlined, FullscreenOutlined, QuestionCircleOutlined,ReloadOutlined } from '@ant-design/icons';
import { addNodes,removeNodes,clearNodes} from '../../redux/action/selectedNodes';
import { UpdateDissimilarSubgraph, UpdateIsSame, UpdateSimilarSubgraph } from '../../redux/action/constrains';
import { dataConfig_new } from '../../config';
import { updateCsvs } from '../../redux/action/csvs';
import { Empty, Popover } from 'antd';
import {DraggableModal} from 'ant-design-draggable-modal';
import 'ant-design-draggable-modal/dist/index.css'
import { updateHistoryCsvs } from '../../redux/action/historyCsvs';


// import 'default-passive-events'
export default function FCTreePairVis(props) {
    const dispatch = useDispatch();
    const treesMd5 = useSelector(state => state.treesMd5); // 本轮当前和历史所有树的md5
    const currentMd5 = treesMd5.currentMd5; // 当前的两颗树的md5
    const pairId = treesMd5.currentId + 1; // 当前pairID
    const selected_msg = useSelector(state => state.selectedNodes); // 被选择节点信息
    const constrains = useSelector(state => state.constrains);
    const round = useSelector(state => state.iterations); // 当前轮数
    const max_round = useSelector(state => state.training.round); // 最大训练轮数（初始输入参数设置）
    const pairs_num = useSelector(state => state.training.pairs); // 最大pairs个数
    const current_pairs_num = useSelector(state => state.samplePairs.current.length); // 表格中的项个数
    const training = useSelector(state => state.training); // 训练参数
    const csvs = useSelector(state => state.csvs); // 当前轮的csvs
    const chart = useSelector(state => state.chart); // 柱状图数据

    // 展开面板
    const [visible, setVisible] = useState(false)
    const onOk = useCallback(() => setVisible(true), [])
    const onCancel = useCallback(() => setVisible(false), [])

    // 连通性判断，获取组别
    const [group1,setGroup1] = useState('');
    const [group2,setGroup2] = useState('');

    // 存储md5：每一层选择节点的详细信息
    // 此数组应和selected_msg同步
    const [md5_nodes,setMd5Nodes] = useState({}); 
    useEffect(() => {
        // console.log("treesMd5: ",currentMd5)
        if (!currentMd5.length)  
        {
            return;
        }
        draw_pairs()
    }, [treesMd5,currentMd5]);

    useEffect(() => {
        if (JSON.stringify(csvs)!=="[]") // 初始
        {
            // 存储历史csvs
            dispatch(updateHistoryCsvs(csvs));
        }
    }, [csvs]);

    useEffect(() => {
        if (chart.current.csvs.length) { // 初始态不记录
            // console.log("chart: ",chart)
            // 更新csv历史数据，即将当前轮数据放入历史轮数据中
            dispatch({type: 'updateHistoryChart'});
        }
    }, [chart.current]);

    useEffect(() => {
        if (visible) {
            if (document.querySelector('.vis-panel1').innerHTML === '' &&
                document.querySelector('.vis-panel2').innerHTML === '')
            {
                return;
            }
            getFCtree((data)=>{
                setGroup1(data.label); // label就是组别
                GridTreeNew(
                    d3,
                    "",
                    data,
                    ".vis-panel3",
                    getUserInteraction,
                    getSelectDetailsNodes,
                )
            },training.datasetName,currentMd5[0])
            
            getFCtree((data)=>{
                // console.log("tree2: ",data)
                setGroup2(data.label);
                GridTreeNew(
                    d3,
                    "",
                    data,
                    ".vis-panel4",
                    getUserInteraction,
                    getSelectDetailsNodes,
                )
            },training.datasetName,currentMd5[1])
            
        }
    }, [visible])

    const draw_pairs = () => {
        getFCtree((data)=>{
            // console.log("tree1: ",data)
            setGroup1(data.label);
            GridTreeNew(
                d3,
                "",
                data,
                ".vis-panel1",
                getUserInteraction,
                getSelectDetailsNodes,
            )
        },training.datasetName,currentMd5[0])
        
        getFCtree((data)=>{
            // console.log("tree2: ",data)
            setGroup2(data.label);
            GridTreeNew(
                d3,
                "",
                data,
                ".vis-panel2",
                getUserInteraction,
                getSelectDetailsNodes,
            )
        },training.datasetName,currentMd5[1])

        if (visible) {
            getFCtree((data)=>{
                // console.log("tree1: ",data)
                setGroup1(data.label);
                GridTreeNew(
                    d3,
                    "",
                    data,
                    ".vis-panel3",
                    getUserInteraction,
                    getSelectDetailsNodes,
                )
            },training.datasetName,currentMd5[0])
            
            getFCtree((data)=>{
                // console.log("tree2: ",data)
                setGroup2(data.label);
                GridTreeNew(
                    d3,
                    "",
                    data,
                    ".vis-panel4",
                    getUserInteraction,
                    getSelectDetailsNodes,
                )
            },training.datasetName,currentMd5[1])
        }
    }

    // d3.js内交互，调用后设置selected_msg
    const getUserInteraction = (msg) => {
        // console.log("msg: ",msg)
        const {type,data} = msg;
        if (type === "add"){
            dispatch(addNodes(data))
        } else if (type === "remove"){
            dispatch(removeNodes(data))
        } else if (type === "clear") {
            dispatch(clearNodes(data))
        }
    }
    
    
    // 获取详细的选择信息，用于判断是否为连通树
    const getSelectDetailsNodes = (md5,data) => {
        setMd5Nodes(prev=>{
            prev[md5] = data;
            return prev;
        })
    }

    const isConnectedTree = (md5) => {
            if (!md5_nodes.hasOwnProperty(md5)){
                return false;
            }
            if (currentMd5.length === 0){
                return false;
            }
    
            let len = md5_nodes[md5].length;
            // 最大层数
            let max_layer = 0;
            for (let i = len - 1; i >= 0; i--) {
                if (md5_nodes[md5][i].length){
                    max_layer = i;
                    break;
                }
            }
            // 定位到被选节点中最小层的层数
            let min_layer = 0;
            for (let i = 0; i < len; i++) {
                if (md5_nodes[md5][i].length){
                    min_layer = i;
                    break;
                }
            }
    
            // 只选择了一个节点
            if (min_layer === max_layer) {
                return true;
            }
    
            // 判断此层节点数是否大于1
            if (md5_nodes[md5][min_layer].length !== 1) {
                return false;
            } else {
                // 第一层只有一个节点
                // 判断父子关系
                for (let i = min_layer; i < max_layer; i++) {
                    // 第i层所有节点的名字集合
                    let P = [];
                    // 把第i层所有节点的名字放入P中
                    for (let node of md5_nodes[md5][i]) {
                        P.push(node.callee);
                    }
                    // 判断i+1层是否有节点
                    if (md5_nodes[md5][i+1].length === 0)
                    {
                        return false; // 某一层为空则不连通
                    } else {
                        // 不为空，则判断i+1层所有节点的父亲是否属于P集合
                        for (let node of md5_nodes[md5][i+1]) {
                            for (let k = 0; k < P.length; k++) {
                                if (node.caller === P[k]) {
                                    // 属于P，则返回true
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
            }
        }
    

    const submitAllHandler = () => {
        if (currentMd5.length === 0){
            Message.warning({
                content: 'Create a model or request data first!',
            });
            return;
        }
        // 判断是否做完题目
        if (current_pairs_num !== pairs_num*2)
        {
            Message.warning({
                content: 'Please complete all questions before submitting!',
            });
            return;
        }

        // 清除图像
        document.querySelector('.vis-panel1').innerHTML = '';
        document.querySelector('.vis-panel2').innerHTML = '';


        // 增加轮数，即训练是第几轮
        dispatch({type:'UpdateIterations'})
        // 如果是最后一轮结束，则使得输入框可输入
        if(round >= max_round) {
            // 获取最后一轮的训练结果
            request_submitAllConstrains(true); // 结束
            dispatch({type:'ableInput'})
            // 清除iterations
            dispatch({type:'ClearIterations'})
            // 清除选择的所有nodes，因为下一次要选择新的nodes
            getUserInteraction({type:'clear'}); 
            //归零pairId
            dispatch({type: 'clearTreesMd5'});
            Message.info({
                content: 'All training rounds are complete! You can view historical bar and table information.',
            });
        } else {
            // 提交成对约束
            request_submitAllConstrains(false); // 未结束
        }

        // 清除本轮所有constrains, 清除的原因是保证下一轮约束数组为空
        dispatch({type:'clearAllConstrains'})  
        // 更新历史表格中的数据，即将当前轮数据放入历史轮数据中
        dispatch({type:"updateHistorySample"})
    }

    const request_submitAllConstrains = (isEnd) => {
        let allConstrains = [];
        
        for (let key in constrains) {
            let item = constrains[key];
            let constrain = {
                fileMD51: (item.fileMD51 && item.fileMD51.length>0) ? item.fileMD51 : currentMd5[0],
                fileMD52: (item.fileMD52 && item.fileMD52.length>0) ? item.fileMD52 : currentMd5[1],
                isSame: item.isSame,
                similarSubgraph: item.similarSubgraph,
                dissimilarSubgraph: item.dissimilarSubgraph,
            };
            allConstrains.push(constrain);
        }
        let params = {
            datasetName: training.datasetName,
            constraints: allConstrains,
            trainStrategy: training.trainStrategy,
        }
        let md5_data = {
            numOfSamplePairs: training.pairs,
            datasetName: training.datasetName,
            queryStrategy: training.queryStrategy,
        }
        // console.log("params: ",params)
        upDataPairwiseConstraints(params,md5_data,request_cluster_data,request_md5_data,isEnd); // 异步请求，按照顺序
    }

    // 请求 固定的cluster 数据
    const request_cluster_data = (data) => {
        gets_cluster(
        (msg) => {
            dispatch(updateCsvs(msg));
        },
        dataConfig_new
        ); 
    };

    // 请求 获取初始md5
    const request_md5_data = (data) => {
        getNextQuery(
            (val) => {
                dispatch(setTreesMd5(val));
            },
            data
        )
    }

    const upButtonHandler = () => {
        if (currentMd5.length === 0){
            Message.warning({
                content: 'Create a model or request data first!',
            });
            return;
        }
        if (document.querySelector('.vis-panel1').innerHTML === '' &&
                document.querySelector('.vis-panel2').innerHTML === '')
        {
            Message.error({
                content: 'Please wait until the data is loaded!',
            });
            return;
        }
        dispatch({type:'prevTreesMd5'})
    }

    const downButtonHandler = () => {
        if (currentMd5.length === 0){
            Message.warning({
                content: 'Create a model or request data first!',
            });
            return;
        }
        if (document.querySelector('.vis-panel1').innerHTML === '' &&
                document.querySelector('.vis-panel2').innerHTML === '')
        {
            Message.error({
                content: 'Please wait until the data is loaded!',
            });
            return;
        }
        if (pairId === pairs_num) {
            Message.warning({
                content: 'It is the end! Please submit all constraints.',
            });
            return;
        }
        if (constrains[pairId] === undefined || constrains[pairId].isSame === 'init') {
            Message.warning({
                content: 'Must and Cannot are mandatory!',
            });
            return;
        }
        dispatch({type:'nextTreesMd5'})
    }

    const operationsHandler = (type) => {
        if (currentMd5.length === 0){
            Message.warning({
                content: 'Create a model or request data first!',
            });
            return;
        }
        switch (type) {
            case 'Must':
                if (document.querySelector('.vis-panel1').innerHTML === '' &&
                document.querySelector('.vis-panel2').innerHTML === '')
                {
                    Message.error({
                        content: 'Wait until the data is loaded before selecting!',
                    });
                    return;
                }
                Message.info({
                    content: 'Set to Must',
                });
                dispatch(UpdateIsSame({id:pairId,isSame: true,group1: group1, group2: group2}));
                return; 

            case 'Cannot':
                if (document.querySelector('.vis-panel1').innerHTML === '' &&
                document.querySelector('.vis-panel2').innerHTML === '')
                {
                    Message.error({
                        content: 'Wait until the data is loaded before selecting!',
                    });
                    return;
                }
                Message.info({
                    content: 'Set to Cannot',
                });
                dispatch(UpdateIsSame({id:pairId,isSame: false,group1: group1, group2: group2}));
                // console.log("Cannot" , constrains)
                return;

            // 存放子树
            case 'Similar':
                if (!isConnectedTree(currentMd5[0])) {
                    Message.warning({
                        content: 'Tree1 can add Similar constraints only if connected subtrees are selected!',
                    });
                    //draw_pairs(); // 重新绘制图，清除选择边框
                    return;
                }
                if (!isConnectedTree(currentMd5[1])) {
                    Message.warning({
                        content: 'Tree2 can add Similar constraints only if connected subtrees are selected!',
                    });
                    //draw_pairs(); // 重新绘制图，清除选择边框
                    return;
                }

                getUserInteraction({type:'clear'}); // 清除选择的所有nodes，因为下一次要选择新的nodes
                
                // 先选择isSame才能选择其他约束
                if (constrains[pairId] === undefined || constrains[pairId].isSame === 'init'){
                    Message.warning({
                        content: 'Please select Must or Cannot before adding constraints!',
                    });
                    // 去除已经选中的框
                    draw_pairs(); // 重新绘制图，清除选择边框
                    return;
                }
                
                let md5 = [];
                let graph = [[],[]];

                for (let key in selected_msg) {

                    md5.push(key);
                    if (key === currentMd5[0]) {
                        graph[0] = selected_msg[key];
                    } else if(key === currentMd5[1]) {
                        graph[1] = selected_msg[key];
                    }
                }
                // 判断是否有选中
                if (graph.length === 0) {
                    Message.warning({
                        content: 'Select NULL!',
                    });
                    return;
                }
                if (md5.length !== 2) {
                    Message.warning({
                        content: 'Please select a complete set of constraints!',
                    });
                    draw_pairs(); // 重新绘制图，清除选择边框
                    return;
                }
                // 
                const msg = {
                    id:pairId,
                    fileMD51: currentMd5[0],  
                    fileMD52: currentMd5[1], 
                    similarSubgraph: graph,
                }
                // console.log("msg: ",msg)
                dispatch(UpdateSimilarSubgraph(msg)); // 更新约束
                draw_pairs(); // 重新绘制图，清除选择边框
                return;

            case 'UnSimilar':

                if (!isConnectedTree(currentMd5[0])) {
                    Message.warning({
                        content: 'Tree1 can add UnSimilar constraints only if connected subtrees are selected!',
                    });
                    return;
                }
                if (!isConnectedTree(currentMd5[1])) {
                    Message.warning({
                        content: 'Tree2 can add UnSimilar constraints only if connected subtrees are selected!',
                    });
                    return;
                }

                getUserInteraction({type:'clear'}); // 清除选择的所有nodes，因为下一次要选择新的nodes
                // 先选择isSame才能选择其他约束
                if (constrains[pairId] === undefined || constrains[pairId].isSame === 'init'){
                    Message.warning({
                        content: 'Please select Must or Cannot before adding constraints!',
                    });
                    // 去除已经选中的框
                    draw_pairs(); // 重新绘制图，清除选择边框
                    return;
                }
                let md5_ = [];
                let graph_ = [[],[]];

                for (let key in selected_msg) {
                    md5_.push(key);
                    if (key === currentMd5[0]) {
                        graph_[0] = selected_msg[key];
                    } else if(key === currentMd5[1]) {
                        graph_[1] = selected_msg[key];
                    }
                }
                // 判断是否有选中
                if (graph_.length === 0) {
                    Message.warning({
                        content: 'Select NULL !',
                    });
                    return;
                }
                if (md5_.length !== 2) {
                    Message.warning({
                        content: 'Please select a complete set of constraints!',
                    });
                    draw_pairs(); // 重新绘制图，清除选择边框
                    return;
                }
                const msg_ = {
                    id:pairId,
                    fileMD51: md5_[0],  
                    fileMD52: md5_[1], 
                    dissimilarSubgraph: graph_,
                    md5_subGraph: [
                        {
                            md5: md5_[0],
                            graph: graph_[0],
                        },
                        {
                            md5: md5_[1],
                            graph: graph_[1],
                        }
                    ]
                }
                dispatch(UpdateDissimilarSubgraph(msg_)); // 更新约束
                draw_pairs(); // 重新绘制图，清除选择边框
                return;

            default:
                return;
        }
    }


    return (
        <div>
            <div className="summary-header style-around">
                <IconStorage className='icon1'/>
                Function Call Visualization of Sample Pair
                <Button className="submitAll" size='small' onClick={submitAllHandler}>Submit All Constrains</Button>
            </div>

            <div className="visualization">

                <div className='change-button'>
                    <CaretUpOutlined className='up-button' onClick={upButtonHandler}/>
                    <div className='pair-msg'> P {pairId}/{pairs_num}</div>
                    <CaretDownOutlined className='down-button' onClick={downButtonHandler}/>
                </div>

                <div>
                    <div className="vis-pair1">
                        {/* 标头的信息 */}
                        <div className="details">
                            <div className="line1">
                                {/* <span className="uid">UUid:{props.uid}</span>
                                <span className="unique-func">Unique Functions:</span>
                                <span className="func-calls">Function Calls:</span> */}
                            </div>
                            <div className="line2">
                                <span className="md5">MD5:{currentMd5[0]}</span>
                                {/* <span className="sensitive">Sensitive Functions:</span> */}
                                {/* <span className="call-paths">Call Paths:</span> */}
                            </div>
                        </div>
                        {/* 可视化面板 */}
                        <div className="fctree vis-panel1" style={{visibility:visible?'hidden':'visible'}}>
                            {!currentMd5.length&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Data not loaded!"/>}
                        </div>
                    </div>

                    <div className="vis-operations">
                        {/* <QuestionCircleOutlined style={{marginRight:'1.5rem'}} onClick={}/> */}
                        <Button className="my-button1 step1" onClick={()=>operationsHandler('Must')} >Must</Button>
                        <Button className="my-button1 step2" onClick={()=>operationsHandler('Cannot')} >Cannot</Button>
                        <Button className="my-button1 step3" onClick={()=>operationsHandler('Similar')} >Similar</Button>
                        <Button className="my-button1" onClick={()=>operationsHandler('UnSimilar')} >UnSimilar</Button>

                        <Popover content={(
                                <div style={{ width: 280,borderRadius:'16px'}}>
                                  <p>1. You can click this button to enlarge the visual panel, and the original panel will disappear when the new panel pops up.</p>
                                  <p>2. You can still add constraints using the original button.</p>
                                </div>
                              )} title="Help">
                            <FullscreenOutlined className="expandButton step4" onClick={onOk}/>
                        </Popover>
                        {/* 可拖拽Modal，显示扩大的面板 */}
                        <DraggableModal
                        open={visible}
                        onOk={onOk}
                        onCancel={onCancel}
                        footer={[
                            <Popover content={(
                                <div style={{ width: 260,borderRadius:'16px'}}>
                                <p>1. You can zoom in and out of the panel by pulling the lower right corner.</p>
                                <p>2. You can drag the top header row to move it.</p>
                                </div>
                            )} 
                            key="help"
                            title="Help">
                                <QuestionCircleOutlined style={{marginRight:'1.5rem'}}/>
                            </Popover>,
                            <Button key="Must" className="my-button1" onClick={()=>operationsHandler('Must')} >Must</Button>,
                            <Button key="Cannot" className="my-button1" onClick={()=>operationsHandler('Cannot')} >Cannot</Button>,
                            <Button key="Similar" className="my-button1" onClick={()=>operationsHandler('Similar')}>Similar</Button>,
                            <Button key="UnSimilar" className="my-button1" onClick={()=>operationsHandler('UnSimilar')}>UnSimilar</Button>,
                            <Button key="back" className="my-button1" onClick={() => setVisible(false)}>
                            Return
                            </Button>,
                        ]}
                        >
                            <div className="vis-pair3">
                                {/* 标头的信息 */}
                                <div className="details">
                                    <div className="line1">
                                        {/* <span className="uid">UUid:{props.uid}</span>
                                        <span className="unique-func">Unique Functions:</span>
                                        <span className="func-calls">Function Calls:</span> */}
                                    </div>
                                    <div className="line2">
                                        <span className="md5">MD5:{currentMd5[0]}</span>
                                        {/* <span className="sensitive">Sensitive Functions:</span> */}
                                        {/* <span className="call-paths">Call Paths:</span> */}
                                    </div>
                                </div>
                                {/* 可视化面板 */}
                                <div className="fctree vis-panel3">
                                    {!currentMd5.length&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Data not loaded!"/>}
                                </div>
                            </div>
                            <div className="vis-pair4">
                                {/* 标头的信息 */}
                                <div className="details">
                                    <div className="line1">
                                        {/* <span className="uid">UUid:{props.uid}</span>
                                        <span className="unique-func">Unique Functions:</span>
                                        <span className="func-calls">Function Calls:</span> */}
                                    </div>
                                    <div className="line2">
                                        <span className="md5">MD5:{currentMd5[1]}</span>
                                        {/* <span className="sensitive">Sensitive Functions:</span>
                                        <span className="call-paths">Call Paths:</span> */}
                                    </div>
                                </div>
                                {/* 可视化面板 */}
                                <div className="fctree vis-panel4">
                                    {!currentMd5.length&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Data not loaded!"/>}
                                </div>
                            </div>
                        </DraggableModal>
                        <ReloadOutlined className="step5" onClick={()=>{
                            if (document.querySelector('.vis-panel1').innerHTML === '' &&
                                document.querySelector('.vis-panel2').innerHTML === '')
                                {
                                    Message.error({
                                        content: 'Wait until the data is loaded before selecting!',
                                    });
                                    return;
                                }
                                draw_pairs(); 
                                getUserInteraction({type:'clear'});
                            }}/>

                        <Popover content={(
                                <div style={{ width: 280,borderRadius:'16px'}}>
                                  <p>Force refresh (bate1.0)</p>
                                </div>
                              )} title="Help">
                            <ReloadOutlined className="step5" onClick={()=>{
                                if (round >= max_round+1) {
                                    Message.error({
                                        content: 'Training has not begun!',
                                    });
                                    return;
                                }
                                Message.info({
                                    content: 'You have refreshed this round of data, please wait patiently for the image to change. If nothing changes, keep trying to refresh!',
                                });
                                request_md5_data({
                                    numOfSamplePairs: training.pairs,
                                    datasetName: training.datasetName,
                                    queryStrategy: training.queryStrategy,
                                });
                                getUserInteraction({type:'clear'});
                            }}/>
                        </Popover> 
                        
                    </div>

                    <div className="vis-pair2">
                        {/* 标头的信息 */}
                        <div className="details">
                            <div className="line1">
                                {/* <span className="uid">UUid:{props.uid}</span>
                                <span className="unique-func">Unique Functions:</span>
                                <span className="func-calls">Function Calls:</span> */}
                            </div>
                            <div className="line2">
                                <span className="md5">MD5:{currentMd5[1]}</span>
                                {/* <span className="sensitive">Sensitive Functions:</span>
                                <span className="call-paths">Call Paths:</span> */}
                            </div>
                        </div>
                        {/* 可视化面板 */}
                        <div className="fctree vis-panel2" style={{visibility:visible?'hidden':'visible'}}>
                            {!currentMd5.length&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Data not loaded!"/>}
                        </div>
                    </div>
                </div>
            </div>
            {/* <Tour open={open} onClose={() => setOpen(false)} steps={steps} /> */}
                               
        </div>
    );
}