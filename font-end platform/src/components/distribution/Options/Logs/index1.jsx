import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import './index1.less'

import {Table,Input,InputNumber,Popconfirm,Typography,Form} from 'antd'
import {useSelector,useDispatch} from 'react-redux'
import { changeCsvsItem, shiftCsvs, updateCsvs } from '../../../../redux/action/csvs';


const cellHeight=32;
function VirtualTable(props) {
  const { columns, scroll } = props;
//   const [tableWidth, setTableWidth] = useState(0);
//   const widthColumnCount = columns.filter(({ width }) => !width).length;
//   const mergedColumns = columns.map((column) => {
//     if (column.width) {
//       return column;
//     }

//     return { ...column, width: Math.floor(tableWidth / widthColumnCount) };
//   });
  const gridRef = useRef();
//   const [connectObject] = useState(() => {
//     const obj = {};
//     Object.defineProperty(obj, 'scrollLeft', {
//       get: () => null,
//       set: (scrollLeft) => {
//         if (gridRef.current) {
//           gridRef.current.scrollTo({
//             scrollLeft,
//           });
//         }
//       },
//     });
//     return obj;
//   });
  //获取表格展示数据
    const dispatch = useDispatch();
    const sample = useSelector(state => state.sample);
    const csvs = useSelector(state => state.csvs)
    //获取表格展示数据
    const [tableData, setTableData] = useState(()=>{
        let data=[];
        for(let i=0;i<csvs.length;i++){
            data.push({
                key:i.toString(),
                uuid_disp:i.toString(),
                md5:csvs[i][0],
                label:csvs[i][1]<10?'G0'+csvs[i][1]:'G'+csvs[i][1],
                confidence:Math.round(csvs[i][5]*100)/100,
                state:'U',
            })
        }
        return data;
    });
//高亮
function highlight(e){
    let index=e.target.getAttribute('index');
    let doms=e.target.parentNode.querySelectorAll(`div[index="${index}"]`);
    if(doms){
        let md5=null;
        if(doms[1]) md5=doms[1].innerText;
        doms.forEach((item)=>{
            item.style.setProperty('background-color', 'rgba(214, 215, 236,0.2)', 'important');
        })
        let sample=document.querySelector(`circle[md5='${md5}']`);
        if(sample){
            setPrimColor(sample.getAttribute("fill"));
            sample.style.fill="red";
            sample.style.r=5;
        }
    }
    // if(e.target.parentNode.children[1]){
    //     let md5=e.target.parentNode.children[1].innerText;
    //     // console.log(e.target)
    //     e.target.parentNode.style.color="#abb1df";
    //     let sample=document.querySelector(`circle[md5='${md5}']`);
    // }
}
function unhighlight(e){
    let index=e.target.getAttribute('index');
    let doms=e.target.parentNode.querySelectorAll(`div[index="${index}"]`);
    if(doms){
        let md5=null;
        if(doms[1]) md5=doms[1].innerText;
        doms.forEach((item)=>{
            item.style.setProperty('background-color', '#fff', 'important');
        })
        let sample=document.querySelector(`circle[md5='${md5}']`);
        if(sample){
            sample.style.fill=primColor;
            sample.style.r=2;
        }
    }
    // if(e.target.parentNode.children[1]){
    //     let md5=e.target.parentNode.children[1].innerText;
    //     e.target.parentNode.style.color="black";
    //     let sample=document.querySelector(`circle[md5='${md5}']`);
    //     // dispatch(updateHighlight(""));
    // }
}
  //可编辑表格部分逻辑
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [primColor, setPrimColor] = useState("");
  const isEditing = (record) => record.key === editingKey;
  //表格处理函数
  const edit = (record) => {
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
        // let findEditObj = tableData.find((item) => {//找到编辑行的数据对象
        //     return item.md5 === md5;
        //     });
        // tableData.splice(index, 1, { ...findEditObj, ...record });//将最新的数据更新到表格数据中
        // setTableData([...tableData]);//设置表格数据
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
  //
//   const resetVirtualGrid = () => {
//     if(gridRef.current){
//         gridRef.current.resetAfterIndices({
//             columnIndex: 0,
//             shouldForceUpdate: true,
//           });
//     }
//   };
  const jumpTo=(rowIndex)=>{
      gridRef.current.scrollToItem({
          align:"smart",
        rowIndex
      });
  }
//   const reloadToken = PubSub.subscribe('jump2pos',(msg,index)=>{
//     jumpTo(index);
//   })
  const outerElementType=forwardRef((props,ref)=>(
    <div ref={ref} onMouseOver={highlight} onMouseOut={unhighlight} {...props}></div>
  ))
//   useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    // ref.current = connectObject;
    const totalHeight = rawData.length * cellHeight;
    const tableWidth = 670/0.8;
    return (
        <Form form={form} component={false}>
            <Grid
                ref={gridRef}
                className="virtual-grid"
                columnCount={columns.length}
                columnWidth={(index) => {
                const { width } = columns[index];
                return totalHeight > scroll.y && index === columns.length - 1
                    ? width - scrollbarSize - 1
                    : width;
                }}
                width={tableWidth}
                height={scroll.y}
                rowCount={rawData.length}
                rowHeight={() => cellHeight}
                // width={tableWidth}
                outerElementType={outerElementType}
                onScroll={({ scrollLeft }) => {
                onScroll({
                    scrollLeft,
                });
                }}
            >
                {({ columnIndex, rowIndex, style }) => {
                    const record=rawData[rowIndex][columns[columnIndex].dataIndex]
                    const rowRecord=rawData[rowIndex]
                    if(columnIndex==3){
                        return(
                            <div
                                className={classNames('virtual-table-cell', {
                                'virtual-table-cell-last': columnIndex === columns.length - 1,
                                })}
                                style={style}
                                index={rowIndex}
                            >
                                {
                                    rowRecord.key === editingKey?(
                                        <Form.Item
                                            name={columns[columnIndex].dataIndex}//dataIndex
                                            style={{margin:0}}
                                            rules={[
                                                {
                                                    required:true,
                                                    massage: `Please input label`,
                                                },
                                                { 
                                                    pattern:new RegExp('(^[G](([0-9]{1,2})|([1-9][0-9]))$)','g'),
                                                    message:'Please mind the format'}
                                            ]}
                                        >{ <Input/>}</Form.Item>)
                                        :record
                                }
                            </div>
                        )
                    }
                    if(columnIndex==4)//是可编辑列
                    {
                        return rowRecord.key === editingKey?(//判断是否正在编辑
                            <div
                                className={classNames('virtual-table-cell', {
                                'virtual-table-cell-last': columnIndex === columns.length - 1,
                                })}
                                style={style}
                                index={rowIndex}
                            >
                                <span>
                                    <Typography.Link
                                        onClick={() => save(rowRecord)}
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
                            </div>
                        ):(
                            <div
                                className={classNames('virtual-table-cell', {
                                'virtual-table-cell-last': columnIndex === columns.length - 1,
                                })}
                                style={style}
                                index={rowIndex}
                            >
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(rowRecord)} >
                                    Edit
                                </Typography.Link>
                            </div>
                        )
                    }
                    //是否是状态列
                    if(columnIndex==5){
                        const flag=record;
                        return (
                            <div
                                className={classNames('virtual-table-cell', {
                                'virtual-table-cell-last': columnIndex === columns.length - 1,
                                })}
                                style={style}
                                index={rowIndex}
                            >
                                <form className="radio-group">
                                    <div className="radio-item radio-item-U">
                                        <input type="radio" value={"U"+rowIndex} id={"U"+rowIndex} name="select" checked={flag=='U'?true:false} readOnly/>
                                        <label htmlFor={"U"+rowIndex} className="item-text"></label>
                                    </div>
                                    <hr/>
                                    <div className="radio-item radio-item-S">
                                        <input type="radio" value={"S"+rowIndex} id={"S"+rowIndex} name="select" checked={flag=='S'?true:false} readOnly/>
                                        <label htmlFor={"S"+rowIndex} className="item-text"></label>
                                    </div>
                                    <hr/>
                                    <div className="radio-item radio-item-C">
                                        <input type="radio" value={"C"+rowIndex} id={"C"+rowIndex} name="select" checked={flag=='C'?true:false} readOnly/>
                                        <label htmlFor={"C"+rowIndex} className="item-text"></label>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    else{
                        return (
                            <div
                                className={classNames('virtual-table-cell', {
                                'virtual-table-cell-last': columnIndex === columns.length - 1,
                                })}
                                style={style}
                                index={rowIndex}
                            >
                                {rawData[rowIndex][columns[columnIndex].dataIndex]}
                                {/* {EditaleCell(mergedColumns[columnIndex])} */}
                                
                            </div>
                            )}
                        }
                    }
            </Grid>
        </Form>
    );
  };

  return (
    <Table
        {...props}
        size="small"
        dataSource={tableData}
        className="virtual-table"
        columns={columns}
        pagination={false}
        components={{
        body: renderVirtualList,
        }}
    />
  );
} // Usage

export default () => {
    // function highlight(e){
    //     if(e.target.parentNode.children[1]){
    //         let md5=e.target.parentNode.children[1].innerText;
    //         e.target.parentNode.style.color="#abb1df";
    //         let sample=document.querySelector(`circle[md5='${md5}']`);
    //         if(sample){
    //             setPrimColor(sample.getAttribute("fill"));
    //             sample.style.fill="red";
    //             sample.style.r=5;
    //         }
    //     }
    // }
    // function unhighlight(e){
    //     if(e.target.parentNode.children[1]){
    //         let md5=e.target.parentNode.children[1].innerText;
    //         e.target.parentNode.style.color="black";
    //         let sample=document.querySelector(`circle[md5='${md5}']`);
    //         if(sample){
    //             sample.style.fill=primColor;
    //             sample.style.r=2;
    //         }
    //         // dispatch(updateHighlight(""));
    //     }
    // }
    const columns=[
        {
            title:'SampleID',
            dataIndex:'uuid_disp',
            // width:`${90/0.8}px`,
            width:70/0.8,
            align:'center',
        },
        {
            title:'Md5',
            dataIndex:'md5',
            defaultSortOrder:'descend',
            // width:`${230/0.8}px`,
            width:220/0.8,
            align:'center'
    
        },
        {
            title:'Conf.',
            dataIndex:'confidence',//score
            defaultSortOrder:'descend',
            sorter:(a,b)=>a.confidence-b.confidence,
            // width:`${70/0.8}px`,
            width:70/0.8,
            align:'center'
    
        },
        {
            title:'Group',
            dataIndex:'label',
            defaultSortOrder:'ascend',
            sorter:(a,b)=>parseInt(a.label.slice(1))-parseInt(b.label.slice(1)),
            //filter
            // width:`${70/0.8}px`,
            width:70/0.8,
            align:'center',
            editable:true,
        },
        {
            title:'Operation',
            dataIndex:'operation',
            align:'center',
            // width:`${60/0.8}px`,
            width:90/0.8,
            // render:(_,record)=>{
            //     const editable=isEditing(record);
            //     return editable?(
            //         <span>
            //             <Typography.Link
            //                 onClick={() => save(record)}
            //                 style={{
            //                     marginRight: 8,
            //                 }}
            //             >
            //             Save
            //             </Typography.Link>
            //             <Popconfirm title="Do not save changes?" onConfirm={cancel}>
            //                 <a>Cancel</a>
            //             </Popconfirm>
            //         </span>
            //     ):(
            //         <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            //             Edit
            //         </Typography.Link>
            //     )
            // }
        },
        {
            title:'State',
            dataIndex:'state',
            align:'center',
            width:90/0.8,
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
            // render:(text, record, index)=>{
            //     // console.log('render state')
            //     const flag=record.state;
            //     return (
            //         <form className="radio-group">
            //             <div className="radio-item radio-item-U">
            //                 <input type="radio" value={"U"+index} id={"U"+index} name="select" checked={flag=='U'?true:false} readOnly/>
            //                 <label htmlFor={"U"+index} className="item-text"></label>
            //             </div>
            //             <hr/>
            //             <div className="radio-item radio-item-S">
            //                 <input type="radio" value={"S"+index} id={"S"+index} name="select" checked={flag=='S'?true:false} readOnly/>
            //                 <label htmlFor={"S"+index} className="item-text"></label>
            //             </div>
            //             <hr/>
            //             <div className="radio-item radio-item-C">
            //                 <input type="radio" value={"C"+index} id={"C"+index} name="select" checked={flag=='C'?true:false} readOnly/>
            //                 <label htmlFor={"C"+index} className="item-text"></label>
            //             </div>
            //         </form>
            //     )
            // }
        }
    ]
    // const mergeColumns = columns.map((col)=>{
    //     if(!col.editable){
    //         return col;
    //     }
    //     return {
    //         ...col,
    //         onCell: (record) => {
    //             return {
    //                 record,
    //                 inputType: 'number',
    //                 dataIndex: col.dataIndex,
    //                 title: col.title,
    //                 editing: isEditing(record),
    //             }
    //         },
    //     };
    // });

    return(
        <VirtualTable
            columns={columns}
            scroll={{
                y: 300,
                x: 660/0.8,
            }}
        />
    )
}