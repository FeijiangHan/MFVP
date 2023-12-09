import React, { useCallback, useEffect, useState } from 'react';
import { DraggableModal } from 'ant-design-draggable-modal';
import { getFCtree } from '../../network/request';
import { GridTreeNew } from '../../assets/static/js/gridTreeNew';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import './DraggablePanel.css';
import { GridTreeNew2 } from '../../assets/static/js/gridTreeNew_2';

export default function DraggablePanel(props) {
    const training = useSelector(state => state.training); // 训练参数
    // 展开面板
    const [visible, setVisible] = useState(props.state);
    const onOk = useCallback(() =>{
        setVisible(true);
        getFCtree((data)=>{
            GridTreeNew(
                d3,
                "",
                data,
                `.cluster-fctree-${props.index}`,
                (msg)=>{},
                (msg)=>{},
                true
            )
        },training.datasetName, props.md5)
    } , [])
    const onCancel = useCallback(() => {
        setVisible(false);
        props.remove(props.md5); // 删除这个点的信息
    }, [])
    useEffect(()=>{
        getFCtree((data)=>{
            GridTreeNew2(
                d3,
                "",
                data,
                `.cluster-fctree-${props.index}`,
                (msg)=>{},
                (msg)=>{},
            )
        },training.datasetName, props.md5)
    },[])
    return (
        <DraggableModal
        className='DraggableModal-cluster'
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        title={(
            <div className="vis-pair-cluster-details">
                    <div className="md5"><span>MD5: {props.md5}</span></div>
                    <div className="label">label: {props.label}</div>
                    <div className="number">Number: {props.num}</div>
            </div>
        )}
        footer={[
        ]}
        >
            <div className="vis-pair-cluster">
                {/* 可视化面板 */}
                <div className={`cluster-fctree cluster-fctree-${props.index}`}>
                </div>
            </div>  
        </DraggableModal>    
    );
}