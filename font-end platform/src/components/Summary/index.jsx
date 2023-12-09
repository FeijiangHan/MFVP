
import SummaryInfo from './info/SummaryInfo'
import SummaryTable from './table/SummaryTable'
import Charts from './Charts'
import {Divider} from 'antd'
import './index.less'
import {dataConfig} from '../../config';
import {useState,useEffect} from 'react' 
import {useDispatch,useSelector} from 'react-redux';
import {updateStatistic} from '../../redux/action/statistic'
import { gets_cluster_tips } from "../../assets/static/js/gets_clusterTips";
import { gets_cluster} from '../../network/request';
import { deepCopy } from '../../assets/static/js/deepcopy';
import {connect} from 'react-redux';
import {getNextQuery,UpdataPairwiseConstraints} from '../../network/request'
import { nextQuery } from '../../redux/action/next'

function Summary(){
    const [csvs,setCsvs]=useState([]);
    const [dataNum,setDataNum]=useState(0);
    const [labelNum,setLabelNum]=useState(0);
    const [tableData,setTableData]=useState([]);
    const [normalNum, setNormalNum] = useState(0);
    const [outLiers, setOutLiers] = useState(0);
    const md5 = useSelector(state => state.nextQuery.treeMd5) 
    const dispatch = useDispatch();
    
    //getData();
    useEffect(()=>{
        request_cluster_datas();
    },[])

    function request_cluster_datas(){
        // console.log("request_cluster_datas",dataConfig)
        gets_cluster(
            get_cluster_datas,
            dataConfig
        )
    }

    function get_cluster_datas(val){
        // console.log("测试val：",val)
        setCsvs(val);
        setDataNum(val.length);
        const result =gets_cluster_tips(val);
        setLabelNum(result['label_nums']-1)//去掉离群点
        let label_data={}
        let out_num=0;
        for(let i=0;i<val.length;i++){
            let item=null;
            if(val[i][1]<10&&val[i][1]!=-1){
                item="G0"+val[i][1];
            }
            else{
                item="G"+val[i][1];
            }
            if(!label_data[item]){
                label_data[item]=[]
            }
            label_data[item].push(val[i][5])
            // label_data[item]["total_num"]+=1;//数目
            // label_data[item]["score"]+=val[i][5];//分数
            if(item==="G-1"){
                out_num+=1;
            }
        }
        // console.log(label_data);
        setOutLiers(out_num);
        setNormalNum(val.length-out_num);
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
        setTableData(datas);
        dispatch(updateStatistic(datas));
    }
    
    let familyState = false;
    function YES_sameFamily()
    {
        familyState = true;
    }
    function NO_sameFamily()
    {
        familyState = false;
    }

    
    function nextFctree(n)
    {
        // let query = getNextQuery();
        // const treeMd5 = query['res'];
        // let data = []
        // treeMd5.forEach((item)=>{
        //     data.push({label: item[0]})
        //     data.push({label: item[1]})
        // }) 
        let testdate = []
        for (let i = 0; i < n; i++)
        {
            let map = {"label":i}
            testdate.push(map);
        }
        // 更新数据集样本
        dispatch(nextQuery(testdate))
        // 把样本结果提交给服务器
        
    }

    return(
        <div className='summary-part column'>
            {/* <SummaryInfo sampleNum={dataNum} familyNum={labelNum} normalNum={normalNum} outLiers={outLiers}/>
            
            <Charts family_data={tableData} sample_data={csvs}/>
            <SummaryTable data={tableData}/> */}
            
        </div>
    )
}



export default Summary