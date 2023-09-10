import { Layout } from '@arco-design/web-react';
import classes from './HistoryIteration.module.css';
import Charts from '../Summary/Charts';
import {React, useState, useCallback, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { FullscreenOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Empty, Popover } from 'antd';
import { DraggableModal } from 'ant-design-draggable-modal';
import PubSub from 'pubsub-js';
import Cluster from '../distribution/cluster';
import { create_cluster_new } from '../../assets/static/js/create_cluster_new';
import * as d3v6 from 'd3v6';
import { Message } from '@arco-design/web-react';
import { create_xy_new } from '../../assets/static/js/create_xy_new';

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;


export default function HistoryIteration(props) {
    const [visible, setVisible] = useState(false)
    const onOk = useCallback(() => setVisible(true), [])
    const onCancel = useCallback(() => setVisible(false), [])
    const important=useSelector(state=>state.important);

    const historyCsvs = useSelector(state => state.historyCsvs);
    const currentCsvs = historyCsvs[props.round];
    const chart = useSelector(state => state.chart);
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
        important //data_rem
      );
    };

    // 绘制直方图
    const drawHistGraph = (family_data,space) => {
      if (family_data.length > 0) {
          create_xy_new(d3v6,`${space}`,370,170,family_data,{xTitle:"Group",yTitle:"Number"});
      }
  }

  const makeAllHistGraph = (space)=> {
      if (!historyCsvs.length) {
          Message.warning({
              content: '无数据！',
          });
          return;
      }
       drawHistGraph(chart.history[chart.history.length - props.round - 1].tableData,`${space}`)
  }

    return (
    <Layout className={classes.layout}>
        <Header className={`${classes.header} summary-header`}>
          {props.round ? `Round ${props.round}`: 'Init State' }
          <Popover content={(
                                <div>
                                <p>点击展开此轮聚类图</p>
                                </div>
                            )}>
              <FullscreenOutlined 
              style={{float:'right',marginRight:'2rem',transform:'translateY(7px)',color:'#898ba3'}}
              onClick={onOk}/>
          </Popover>
          
          <DraggableModal
                        title={props.round ? `Cluster: Round ${props.round}`: 'Init State'}
                        open={visible}
                        onOk={onOk}
                        onCancel={onCancel}
                        footer={[
                            <Popover content={(
                                <div>
                                <p>1. 您可以拉动右下角以放大和缩小面板。</p>
                                <p>2. 您可以拖拽顶部标题行进行移动。</p>
                                </div>
                            )} key="help" title="Helper">
                                <QuestionCircleOutlined style={{marginRight:'1.5rem'}}/>
                            </Popover>,
                            <Button key="cluster" onClick={() => {
                              // console.log("historyCsvs: ",historyCsvs)
                              // console.log("historyCsvs[historyCsvsLen-props.round]: ",historyCsvs[historyCsvsLen-props.round-1].csvs)
                                create_cluster_show(currentCsvs,`.cluster-${props.round}`);
                                }
                              }>
                              获取此轮历史聚类图
                            </Button>,
                            <Button key="var" onClick={() => {
                                makeAllHistGraph(`.cluster-${props.round}`);
                                }
                              }>
                              获取此轮历史柱状图
                            </Button>,
                            <Button key="back" onClick={() => setVisible(false)}>
                              Return
                            </Button>,
                        ]}
                        >
                        {JSON.stringify(currentCsvs)==="[]" && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="数据未加载" className='empty-cluster'/>}
                        <div className={`cluster-${props.round}`}>
                        </div>
                        
            </DraggableModal>
        </Header>
        
        <Layout>
          <Sider className={classes.sider} style={{ width: '24%' }}>
            <div className={classes['info-item']}>
                <span className={classes["info-title"]}>Groups: {props.familyNum}</span>
                <span className={classes["info-content"]}></span>
            </div>
            <div className={classes["info-item"]}>
                <span className={classes["info-title"]}>Outliers: {props.outLiers}</span>
                <span className={classes["info-content"]}></span>
            </div>
          </Sider>
          <Sider className={classes.sider} style={{ width: '79%',transform: 'translateX(-1rem)'}}>
            <Charts family_data={props.tableData} sample_data={props.csvs} type={'history'} space={`history-chart-${props.round}`}/>
          </Sider>
          {/* <Content>Content</Content> */}
        </Layout>
    </Layout>
    );
}