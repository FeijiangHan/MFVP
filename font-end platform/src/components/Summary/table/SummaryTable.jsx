
import './index.less';
import {updateFamily} from '../../../redux/action/family';
import useWindowDimensions from '../../window'
import {Table,Pagination, Button} from 'antd'
import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
const {Column,ColumnGroup}=Table

const columns=[
    {
        title:'Group ID',
        dataIndex:'familyId',
        defaultSortOrder:'ascend',
        sorter:(a,b)=>parseInt(a.familyId.slice(1))-parseInt(b.familyId.slice(1)),
        // width:`${60/0.8}px`,
        align:'center',
        className:"group-id",
    },
    {
        title:'Samples',
        dataIndex:'number',
        defaultSortOrder:'descend',
        sorter:(a,b)=>a.number-b.number,
        // width:`${48/0.8}px`,
        // width:`${70/0.8}px`,
        align:'center'

    },
    {
        title:'Stability',
        dataIndex:'weighted',
        defaultSortOrder:'descend',
        sorter:(a,b)=>a.weighted-b.weighted,
        align:'center',
        render:(text)=>{
            return Math.round(text*100)/100;
        }
    },
    // {
    //     title:'Conf.VAR',
    //     dataIndex:'var',
    //     defaultSortOrder:'descend',
    //     sorter:(a,b)=>a.var-b.var,
    //     align:'center'

    // },
]

function itemRender(current,type,originElement){
    if(type==='prev'){
        return <a>Prev</a>
    }
    if(type==='next'){
        return <a>Next</a>
    }
    return originElement
}
export default function SummaryTable({data}){
    const pageSize=13;
    const {height,width}=useWindowDimensions();
    const [page, setPage] = useState(1);
    const [selectedFamily, setSelectedFamily]=useState([]);
    const dispatch=useDispatch();
    const rowSelection = {
        onChange:(selectedRowKeys,selectedRows)=>{
            //// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            const selected = [];
            for(let i=0;i<selectedRows.length;i++){
                selected.push(selectedRows[i].familyId);
            }
            setSelectedFamily(selected);
        },
        getCheckboxProps:record=>({
            disabled:record.name==='Disabled User',
            name:record.name,
        })
    }
    function dispClick(){
        // console.log("selectedFamily",selectedFamily);
        dispatch(updateFamily(selectedFamily));
    }
    const onChange=(pageNumber)=>{
        setPage(pageNumber)
        // console.log(page)
    }
        return(
            <div className='summary-table'>
                <div className="summary-title">
                    <span>Group List View</span>
                    <Button size="small" className="summary-table-btn" onClick={dispClick}>Display</Button>
                </div>
                <Table 
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{
                        x:columns.reduce((p,c)=>(p+=c.width),0),
                        y:data.length>20&&((height-320)/0.8)
                    }}
                    size="small"/>

                {/* <div>
                    <Pagination 
                        className="summary-table-page"
                        simple 
                        size="small"
                        defaultCurrent={1}
                        total={data.length} 
                        pageSize={pageSize}
                        itemRender={itemRender}
                        onChange={onChange}/>

                    <Button size="small" className="summary-table-btn" onClick={dispClick}>Display</Button>
                </div> */}
                
            </div>
        )
}