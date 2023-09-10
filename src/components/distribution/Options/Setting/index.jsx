import {Switch,Slider} from 'antd';
import {useState} from 'react'
import {useDispatch} from 'react-redux';
import {UpdateImportant} from '../../../../redux/action/important'
import {EditOutlined,FilterOutlined} from '@ant-design/icons'
import {get_important_point} from '../../../../network/request'
import {dataConfig} from '../../../../config'
import './index.less';
function SettingItem({title,Component}){
    return(
        <div className="settings-item">
            <span>{title}</span>
            <span><Component/></span>
        </div>
    )
}
export default function Setting(){
    const dispatch = useDispatch();
    const [globalSample, setGlobalSample] = useState(50);
    const [groupSample, setGroupSample] = useState(50);
    const [convex, setConvex] = useState(0);//0:standard 1:smooth
    const [Outlier, setOutlier] = useState(false);
    const [smallGroup, setSmallGroup] = useState(false);
    const [filterOutliers, setFilterOutliers] = useState(false);
    const [filterOverlaps, setFilterOverlaps] = useState(false);
    const onGlobalChange=value=>{
        setGlobalSample(value);
    }
    const onGroupChange=value=>{
        setGroupSample(value);
    }
    function handle_important(val){
        // console.log("important update")
        dispatch(UpdateImportant(val));
      }
    return (
        <div className="settings-main">
            <div className="settings-part">
                <div className="settings-title">
                    <span><EditOutlined /></span>
                    <span>Pattern Setting</span>
                </div>
                <div className="settings-item">
                    <span>Confidence Color Scale</span>
                    <span className="item-right legend-item">
                        <div className="settings-legend"></div>
                        <div className="settings-legend-coor">
                            <span>-1</span>
                            <span>0</span>
                            <span>1</span>
                        </div>
                    </span>
                </div>
                <div className="settings-item">
                    <span>Standard Convex/Smooth Convex</span>
                    <Switch className="item-right" size="small"/>
                </div>
                <div className="settings-item">
                    <span>Highlight Outliers</span>
                    <Switch className="item-right" size="small"/>
                </div>
                <div className="settings-item">
                    <span>Highlight Small Groups</span>
                    <Switch className="item-right" size="small" onChange={
                        (checked)=>{
                            if(checked){
                                get_important_point(dataConfig,handle_important);
                            }else{
                                dispatch(UpdateImportant([]))
                            }
                          }
                    }/>
                </div>
            </div>
            <div className="settings-part">
                <div className="settings-title">
                    <span><FilterOutlined /></span>
                    <span>Sample Filtering</span>
                </div>
                <div className="settings-item">
                    <span>Global Sample(%) </span>
                    <span className="slider-wrap item-right">
                        <Slider defaultValue={50} onChange={onGlobalChange}/>
                        <span>{globalSample}%</span>
                    </span>
                </div>
                <div className="settings-item">
                    <span>Group Sample(%) </span>
                    <span className="slider-wrap item-right">
                        <Slider defaultValue={50} onChange={onGroupChange}/>
                        <span>{groupSample}%</span>
                    </span>
                </div>
                <div className="settings-item">
                    <span>Filter Outliers and Close Neighbors</span>
                    <span><Switch className="item-right" size="small"/></span>
                </div>
                <div className="settings-item">
                    <span>Filter Overlaps and Filter</span>
                    <span><Switch className="item-right" size="small"/></span>
                </div>
            </div>
        </div>
    )
}