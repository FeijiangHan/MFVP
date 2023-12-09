import React,{useState,useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import './IterationPanel.css';
import SummaryInfo from '../Summary/info/SummaryInfo';
import HistoryIteration from './HistoryIteration'
import Charts from '../Summary/Charts';

import {dataConfig_new} from '../../config';
import {updateStatistic} from '../../redux/action/statistic'
import { gets_cluster_tips } from "../../assets/static/js/gets_clusterTips";
import { gets_cluster } from '../../network/request';
import { IconStorage } from '@arco-design/web-react/icon';
import { UpdateCurrentChart } from '../../redux/action/chart';
import { ExpandAltOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DraggableModal } from 'ant-design-draggable-modal';
import { Button, Card, Empty, Popover } from 'antd';
import { create_cluster_new } from '../../assets/static/js/create_cluster_new';
import * as d3v6 from 'd3v6';
import { Message } from '@arco-design/web-react';
import { create_hist } from '../../assets/static/js/create_hist';
import { create_xy_new } from '../../assets/static/js/create_xy_new';

export default function IterationPanel(props) {

    const dispatch = useDispatch();
    const csvs_1 = useSelector(state => state.csvs);
    const chart = useSelector(state => state.chart);

    const [visible, setVisible] = useState(false)
    const onOk = useCallback(() => setVisible(true), [])
    const onCancel = useCallback(() => setVisible(false), [])

    const historyCsvs = useSelector(state => state.historyCsvs);

    //getData();
    useEffect(()=>{
        get_cluster_data(csvs_1);
    },[csvs_1]) 
    
    useEffect(()=>{
        
    },[chart]) 


    function get_cluster_data(val){
        let val_new = [];
        for (let key in val) {
            let item = val[key];
            let md5 = key;
            let x = item['x'];
            let y = item['y'];
            let labels = item['label'];
            let num = item['familySize'];
            let confidence = item['uncertainty'];

            val_new.push({
                ids: md5,
                labels:labels,
                x:x,
                y:y,
                num:num,
                confidence:confidence
            });
        }

        let chart_data = {tableData:null,csvs:null,dataNum:0,labelNum:0,outLiers:0,normalNum:0};
        chart_data.csvs = val_new;
        chart_data.dataNum = val_new.length;

        const result =gets_cluster_tips(val_new);
        chart_data.labelNum = result['label_nums']-1;

        let label_data={}
        let out_num=0;
        for(let i=0;i<val_new.length;i++){
            let item=null;
            if(val_new[i]['labels'] < 10 && val_new[i]['labels'] !== -1){
                item="G0"+val_new[i]['labels'];
            }
            else{
                item="G"+val_new[i]['labels'];
            }
            if(!label_data[item]){
                label_data[item]=[]
            }
            label_data[item].push(val_new[i]['confidence'])
            if(item==="G-1"){
                out_num+=1;
            }
        }
        chart_data.outLiers = out_num;
        chart_data.normalNum = val_new.length-out_num;

        let datas=[];
        for(let item in label_data){
            let avg=label_data[item].reduce((pre,cur)=>
                {return pre+cur},0)/label_data[item].length
            let variance=label_data[item].reduce((pre,cur)=>{
                return pre+Math.pow(cur-avg,2)
            },0)/label_data[item].length*100;//太小了
            datas.push(
                {
                    key:item,
                    familyId:item,
                    number:label_data[item].length,
                    score:avg,
                    var:variance,
                }
            )
        }
        //方差归一化
        let minVar=Math.min.apply(Math,datas.map(item => { return item.var }))
        let maxVar=Math.max.apply(Math,datas.map(item => { return item.var }))
        datas=datas.map((item)=>{
            return {...item,'var':minVar===maxVar?0:(item.var-minVar)/(maxVar-minVar),}
        })
        datas=datas.map((item)=>{
            return {...item,'weighted':(item.var+item.score)/2}
        })
        chart_data.tableData = datas;
        // console.log("chart_data: ",chart_data)
        dispatch(UpdateCurrentChart(chart_data)); // 更新当前柱状图的csv数据
    }

    // 绘制聚类图
    const create_cluster_show = (csvs, space) => {
        // csvs : 传入的点信息
        let place = space;
        let tag = "left";
        let item = {
        class_filter: "",
        confidence_filter: "",
        convex_hull: true,
        Counter: true,
        Outlier: true,
        scatter_transparency: 0.5,
        };

        let word_cloud_item = {
        flag: false,
        info: null,
        };

        create_cluster_new(
        d3v6,
        place,
        csvs,
        ()=>{},
        tag,
        item,
        (val) => {
            //// console.log("brush", val);
        }, //brush_handle
        [], //data_brush
        "", //flag_find_node
        word_cloud_item,
        null //data_rem
        );
    };

    const makeAllClusterGraph = ()=> {
        if (!historyCsvs.length) {
            Message.warning({
                content: '无数据！',
            });
            return;
        }
        historyCsvs.map((item,index) => create_cluster_show(item,`.cluster-graph-${index}`))
    }

    const drawHistGraph = (family_data,space) => {
        if (family_data.length > 0) {
            create_xy_new(d3v6,`${space}`,370,170,family_data,{xTitle:"Group",yTitle:"Number"});
        }
    }

    const makeAllHistGraph = ()=> {
        if (!historyCsvs.length) {
            Message.warning({
                content: '无数据！',
            });
            return;
        }
        chart.history.map((item,index) => drawHistGraph(item.tableData,`.hist-graph-${chart.history.length - index - 1}`))
    }

    return (
        <div className='ModelIterationView'>
           
            <div className="summary-title">
                Model Iteration View
                <Popover content={(
                                <div>
                                <p>点击展开历史所有聚类图示</p>
                                </div>
                            )}>
                    <ExpandAltOutlined 
                    className='extendAllGraphs'
                    style={{float:'right',marginRight:'2rem',transform:'translateY(7px)',color:'#898ba3'}}
                    onClick={onOk}
                    />
                </Popover>
                
                <DraggableModal
                        open={visible}
                        onOk={onOk}
                        onCancel={onCancel}
                        footer={[
                            <Popover content={(
                                <div style={{ width: 260,borderRadius:'16px'}}>
                                <p>1. 您可以拉动右下角以放大和缩小面板。</p>
                                <p>2. 您可以拖拽顶部标题行进行移动。</p>
                                </div>
                            )} key="help2" title="Helper">
                                <QuestionCircleOutlined style={{marginRight:'1.5rem'}}/>
                            </Popover>,
                            <Button key="cluster2" onClick={makeAllClusterGraph}>
                                获取所有历史聚类图
                            </Button>,
                            <Button key="var2" onClick={makeAllHistGraph}>
                                获取所有历史柱状图
                            </Button>,
                            <Button key="back2" onClick={() => setVisible(false)}>
                              Return
                            </Button>,
                        ]}
                        >
                        {JSON.stringify(historyCsvs)==="[]" && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="数据未加载" className='empty-cluster'/>}
                        {
                            historyCsvs.map((item,index) => 
                            <div className='all-cluster' key={index}>
                                <div className='summary-header'>
                                    {index ? `Round ${index}`: 'Init State' }
                                </div>
                                <div className={`cluster-graph cluster-graph-${index} hist-graph-${index}`}>
                                </div>
                            </div>)
                        }
                        
                </DraggableModal>
            </div>

            <div>
                {/* 当前迭代信息 */}
                <div className="summary-header" >
                    <IconStorage className='icon1'/>    
                    Current Iteration
                </div>
                <SummaryInfo sampleNum={chart.current.dataNum} familyNum={chart.current.labelNum} normalNum={chart.current.normalNum} outLiers={chart.current.outLiers}/>
                <Charts family_data={chart.current.tableData} sample_data={chart.current.csvs} type={'current'} space={`current-chart`}/>

                {/* 历史迭代信息 */}
                <div className="summary-header">
                    <IconStorage className='icon1'/>
                    History Iteration
                </div>
                <div className={'history-iterations'}>
                    {
                        chart.history.map(item=>{
                            return <HistoryIteration 
                            key={item.round}
                            round={item.round}
                            familyNum={item.labelNum}
                            outLiers={item.outLiers}
                            csvs={item.csvs}
                            tableData={item.tableData}
                            />
                        })
                    }
                </div>
            </div>
            
        </div>
    );
}
