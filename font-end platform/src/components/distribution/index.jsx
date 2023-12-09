import Cluster from "./cluster";
import ShowSet from "./ShowSet";
import PubSub from 'pubsub-js';
import {useSelector,useDispatch} from 'react-redux';
import ExportJsonExcel from 'js-export-excel';
import {message,Button} from 'antd';
import "./index.css";
import Options from "./Options";
import {ReloadOutlined} from '@ant-design/icons'
import { deepCopy } from '../../assets/static/js/deepcopy';
import { getsuuidBymd5, get_important_point } from '../../network/request';

export default function Distribution() {
  const csvs = useSelector(state => state.csvs);
  const file = useSelector(state => state.file);
  const important = useSelector(state => state.important);
  //逻辑需要修改
  function downloadExcel(){
    //获取全局csv 获取更改过的csv 
    let res=deepCopy(csvs);
    let changed=file.filter((item)=>{return item['state']=="C"});
    changed.forEach((fileItem)=>{
        let index=res.findIndex((item)=>item.md5==fileItem.md5)
        if(index>-1){
            res[index][1]=fileItem['label'];
        }
    })
    let option={};
    let uid = new Date().getTime() + Math.random().toString(36).substr(2);
    option.fileName=`${uid}`;
    option.datas=[
        {
            sheetData:res,
            sheetName:'sheet',
            sheetHeader:['md5','label','x','y','num','confidence'],
        }
    ];
    let toExecl = new ExportJsonExcel(option);
    message.info(`${uid} downloading...`);
    toExecl.saveExcel();
}
  const BtnOptions=
        <div className="options-btn">
            <Button size="small">Other Settings</Button>
            <Button size="small" onClick={downloadExcel}>Export Result</Button>
        </div>;
  return (
    <div className="cluster-show column">
      <div className="summary-title">
        Group Distribution View
        <ReloadOutlined onClick={()=>{PubSub.publish("reloadCluster",true)}}/>
        {BtnOptions}
      </div>
      <Cluster />
      {/* <Options /> */}
    </div>
  );
}
