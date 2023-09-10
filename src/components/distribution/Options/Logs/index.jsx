
import {Table,Input,InputNumber,Popconfirm,Typography,Form} from 'antd';
import {useEffect,useState,useMemo} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {updateFile,shiftFile} from '../../../../redux/action/file';
import { deepCopy } from '../../../../assets/static/js/deepcopy';
import './index.less'
import { changeCsvsItem, shiftCsvs, updateCsvs } from '../../../../redux/action/csvs';

function getData(){
    let data=[];
    for(let i=0;i<10;i++){
        let item={}
        item['uuid']="ae6d5654c6fd22c0b623f5e5cfec0753";
        item['uuid_disp']=item['uuid'].slice(0,4)+"..."+item['uuid'].slice(-5)
        item['md5']="539995ef62d970ba5c151e0590eb46cf";
        item['confidence']=Math.round(Math.random()*100)/100;
        item['familyId']="G01";
        item['selected']=false;
        data.push(item);
    }
    return data;
}
const EditaleCell = ({
    editing,dataIndex,title,inputType,record,index,children,...restProps
})=>{
    // const inputNode = inputType ==='number' ? <InputNumber/> :<Input/>
    const inputNode = <Input/>
    return (
        <td {...restProps}>
            {editing?(
                <Form.Item
                    name={dataIndex}//dataIndex
                    style={{margin:0}}
                    rules={[
                        {
                            required:true,
                            massage: `Please input ${title}`,
                        },
                        { 
                            pattern:new RegExp('(^[G](([0-9]{1,2})|([1-9][0-9]))$)','g'),
                            message:'Please mind the format'}
                    ]}
                >{inputNode}</Form.Item>
            ):(children)}
        </td>
    )
}

export default function Logs(){
    const dispatch = useDispatch();
    const sample = useSelector(state => state.sample);
    const csvs = useSelector(state => state.csvs)
    //获取表格展示数据
    const [tableData, setTableData] = useState(()=>{
        // console.log("log data loading...")
        let data=[];
        for(let i=0;i<csvs.length;i++){
            data.push({
                key:i.toString(),
                uuid_disp:'...',
                md5:csvs[i][0],
                label:csvs[i][1]<10?'G0'+csvs[i][1]:'G'+csvs[i][1],
                confidence:Math.round(csvs[i][5]*100)/100,
                state:'U',
            })
        }
        return data;
    });
    //可编辑表格部分逻辑
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [primColor, setPrimColor] = useState("");
    const isEditing = (record) => record.key === editingKey;
    //表格处理函数
    const edit = (record) => {
        // console.log(form.getFieldValue())
        form.setFieldsValue({
            label: '',
        });
        setEditingKey(record.key);
    };
    const cancel = ()=>{
        setEditingKey('');
    };
    const save = (record) => {
        // const row = form.validateFields();
        const md5 = record.md5;
        const index = tableData.findIndex((item)=>md5===item.md5);
        if(index>-1){
            //这个地方可改成只更新一条
            setTableData(()=>{
                let newItem={...tableData[index]};
                newItem.state='C';
                newItem.label=form.getFieldsValue().label;
                tableData.splice(index,1,newItem);
                return [...tableData];
            })
            setEditingKey('');
            dispatch(changeCsvsItem({md5:md5,label:parseInt(form.getFieldsValue().label.slice(1))}))
        }
    }
    useEffect(() => {
        const index = tableData.findIndex((item)=>sample.md5===item.md5);
        if(index>-1){
            //这个地方可改成只更新一条
            setTableData(()=>{
                let newItem=tableData[index];
                newItem.state='S';
                // console.log('md5 change item',newItem);
                tableData.splice(index,1,newItem);
                return [...tableData];
            })
        }
    }, [sample])
    function highlight(e){
        if(e.target.parentNode.children[1]){
            let md5=e.target.parentNode.children[1].innerText;
            e.target.parentNode.style.color="#abb1df";
            let sample=document.querySelector(`circle[md5='${md5}']`);
            if(sample){
                setPrimColor(sample.getAttribute("fill"));
                sample.style.fill="red";
                sample.style.r=5;
            }
        }
    }
    function unhighlight(e){
        if(e.target.parentNode.children[1]){
            let md5=e.target.parentNode.children[1].innerText;
            e.target.parentNode.style.color="black";
            let sample=document.querySelector(`circle[md5='${md5}']`);
            if(sample){
                sample.style.fill=primColor;
                sample.style.r=2;
            }
            // dispatch(updateHighlight(""));
        }
    }
    const columns=[
        {
            title:'Uuid',
            dataIndex:'uuid_disp',
            width:`${90/0.8}px`,
            align:'center',
        },
        {
            title:'Md5',
            dataIndex:'md5',
            defaultSortOrder:'descend',
            width:`${230/0.8}px`,
            align:'center'
    
        },
        {
            title:'Conf.',
            dataIndex:'confidence',//score
            defaultSortOrder:'descend',
            sorter:(a,b)=>a.confidence-b.confidence,
            width:`${70/0.8}px`,
            align:'center'
    
        },
        {
            title:'Group',
            dataIndex:'label',
            defaultSortOrder:'descend',
            //filter
            width:`${70/0.8}px`,
            align:'center',
            editable:true,
        },
        {
            title:'Operation',
            dataIndex:'operation',
            align:'center',
            // width:`${60/0.8}px`,
            render:(_,record)=>{
                const editable=isEditing(record);
                return editable?(
                    <span>
                        <Typography.Link
                            onClick={() => save(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                        Save
                        </Typography.Link>
                        <Popconfirm title="Do not save changes?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ):(
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                )
            }
        },
        {
            title:'State',
            dataIndex:'state',
            align:'center',
            filters:[
                {
                    text:'Unselected',
                    value:'U'
                },
                {
                    text:'selected',
                    value:'S'
                },
                {
                    text:'Conf./Mod.',
                    value:'C'
                }
            ],
            onFilter:(value,record)=>{ return record.state==value;},
            render:(text, record, index)=>{
                const flag=record.state;
                return (
                    <form className="radio-group">
                        <div className="radio-item radio-item-U">
                            <input type="radio" value={"U"+index} id={"U"+index} name="select" checked={flag=='U'?true:false} readOnly/>
                            <label htmlFor={"U"+index} className="item-text"></label>
                        </div>
                        <hr/>
                        <div className="radio-item radio-item-S">
                            <input type="radio" value={"S"+index} id={"S"+index} name="select" checked={flag=='S'?true:false} readOnly/>
                            <label htmlFor={"S"+index} className="item-text"></label>
                        </div>
                        <hr/>
                        <div className="radio-item radio-item-C">
                            <input type="radio" value={"C"+index} id={"C"+index} name="select" checked={flag=='C'?true:false} readOnly/>
                            <label htmlFor={"C"+index} className="item-text"></label>
                        </div>
                    </form>
                )
            }
        }
    ]
    const mergeColumns = columns.map((col)=>{
        if(!col.editable){
            return col;
        }
        return {
            ...col,
            onCell: (record) => {
                return {
                    record,
                    inputType: 'number',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }
            },
        };
    });
    //reload散点图

    return (
        <div className="options-log">
            <Form form={form} component={false}>
                <Table
                    dataSource={tableData}
                    components={{
                        body:{
                            cell:EditaleCell,
                        },
                    }}
                    onRow={
                        record=>{
                            return {
                                onMouseEnter:highlight,
                                onMouseLeave:unhighlight,
                            }
                        }
                    }
                    columns={mergeColumns}
                    pagination={false}
                        scroll={{
                            x:columns.reduce((p,c)=>(p+=c.width),0),
                            y:tableData.length>6&&170/0.8
                        }}
                />
            </Form>
        </div>
    )
}