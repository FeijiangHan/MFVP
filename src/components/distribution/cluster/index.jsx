import { useEffect, useState } from "react";
import { useSelector} from "react-redux";
import "./index.less";
import * as d3v6 from 'd3v6';
import PubSub from 'pubsub-js';
import {create_cluster_new} from '../../../assets/static/js/create_cluster_new';
import { Empty } from 'antd';
import DraggablePanel from '../../Part4-tools/DraggablePanel';

// 向外暴露的成员，可以使用任意的变量来接收
export default function Cluster(props) {
  const important=useSelector(state=>state.important);
  const csvs = useSelector(state => state.csvs);

  const [clickedPoint,setClickedPoint] = useState([]);
  const [counter, setCounter] = useState([]);
  const reloadToken = PubSub.subscribe('reloadCluster',(msg,data)=>{
    reload(csvs);
  })

  function reload(){
    create_cluster_show(csvs);
  }

  // 绘制聚类图
  const create_cluster_show = (csvs, cloud_var) => {
    // csvs : 传入的点信息
    let place = ".cluster-main";
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
      info: cloud_var,
    };

    create_cluster_new(
      d3v6,
      place,
      csvs,
      getClusterDotMd5,
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

  // 点击一个点后， 可以得到这个点的md5，然后存储到窗口数据队列中
  function getClusterDotMd5(params){
    setClickedPoint(preState => {
      return [...preState, {
        md5: params.md5,
        label: params.label,
        num: params.num,
        show: true,
      }]
    });
    setCounter(counter+1);
  }
  // 从队列中清除存储的点信息
  function removeDot(md5){
    setCounter(counter-1);
    if (counter === 0) {
      setClickedPoint([]);
    }
  }

  // 重新绘制
  useEffect(() => {
    create_cluster_show(csvs);
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [csvs])

  // // 重新绘制
  // useEffect(() => {
  //   console.log("data ",clickedPoint)
  // // eslint-disable-next-line react-hooks/exhaustive-deps  
  // }, [clickedPoint])

  return (
    <div className="cluster">
      {JSON.stringify(csvs)==="[]" && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="数据未加载" className='empty-cluster' />}
      <div className="cluster-main">
      </div>
      {
        clickedPoint.map((currentValue, index) => {
          return <DraggablePanel 
          key={index} 
          index={index} 
          state={currentValue.show} // 是否展开面板
          md5={currentValue.md5} 
          label={currentValue.label} 
          num={currentValue.num} 
          remove={removeDot}
          />
        })
      }
      
    </div>
  );
}
