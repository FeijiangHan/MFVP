import PubSub from 'pubsub-js';
import ExportJsonExcel from 'js-export-excel';
import {Tabs,Button,message} from 'antd';
import {ExpandAltOutlined} from '@ant-design/icons'
import {useSelector,useDispatch} from 'react-redux';
import {UpdateHistShow} from '../../../redux/action/history';
import Logs from './Logs';
import Setting from './Setting';
import TestTable from './Logs/index1'
import { deepCopy } from '../../../assets/static/js/deepcopy';
import './index.less'
import { getsMsv, getsuuidBymd5, get_test } from '../../../network/request';
const {TabPane} =Tabs;
function callback(key){
    // console.log(key);
}
export default function Options(){
    // const csvs = useSelector(state => state.csvs);
    // const file = useSelector(state => state.file);
    const dispatch = useDispatch();
    // function downloadExcel(){
    //     //获取全局csv 获取更改过的csv 
    //     let res=deepCopy(csvs);
    //     let changed=file.filter((item)=>{return item['state']=="C"});
    //     changed.forEach((fileItem)=>{
    //         let index=res.findIndex((item)=>item.md5==fileItem.md5)
    //         if(index>-1){
    //             res[index][1]=fileItem['label'];
    //         }
    //     })
    //     let option={};
    //     let uid = new Date().getTime() + Math.random().toString(36).substr(2);
    //     option.fileName=`${uid}`;
    //     option.datas=[
    //         {
    //             sheetData:res,
    //             sheetName:'sheet',
    //             sheetHeader:['md5','label','x','y','num','confidence'],
    //         }
    //     ];
    //     let toExecl = new ExportJsonExcel(option);
    //     message.info(`${uid} downloading...`);
    //     toExecl.saveExcel();
    // }
    // const BtnOptions=
    //     <div className="options-btn">
    //         <Button size="small" onClick={
    //             // ()=>{
    //             // getsMsv({
    //             // md5s:'5d0ae0a7027df869372f540f56adde3d',
    //             // uuids:'244f43918602d4bf44892d0b61cdce39',
    //             // },
    //             // (val)=>{// console.log("msv",val);}
    //             // )}
    //             ()=>{
    //                 getsuuidBymd5({md5:'5d0ae0a7027df869372f540f56adde3d'}
    //                 ,(val)=>{// console.log('uuid',val)}
    //                 )
    //             }
            
    //         }>Other Settings</Button>
    //         <Button size="small" onClick={downloadExcel}>Export Result</Button>
    //         <Button size="small" onClick={()=>{PubSub.publish("reloadCluster",true)}}>Reload</Button>
    //     </div>;
    const genOpcodeTable=()=>{
        dispatch(UpdateHistShow(true));
    }
    // const operations=<Button size="small" onClick={
    //     ()=>{
    //         PubSub.publish("jumpTo",100);
    //     }
    
    // }>Test</Button>
    return (
        <div className="options-main">
            <Tabs defaultActiveKey="1"  onChange={callback} centered>
                <TabPane tab="Setting & Filtering" key="1">
                <Setting/>
                </TabPane>
                {/* <TabPane 
                    tab={
                        <div>
                            Sample Vertification Info
                            <ExpandAltOutlined onClick={genOpcodeTable}/>
                        </div>
                    } 
                    key="2"
                >
                <Logs/>
                </TabPane> */}
                <TabPane tab={
                <div>
                    Sample Vertification Info
                    <ExpandAltOutlined onClick={genOpcodeTable}/>
                </div>} 
                    key='2'>
                    <TestTable/>
                </TabPane>
            </Tabs>
        </div>
    )
}