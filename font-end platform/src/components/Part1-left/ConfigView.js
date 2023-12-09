import React, { useState } from 'react';
import classes from './ConfigView.module.css'
import { Form, Input,Button,InputNumber,Grid,Select, Message } from '@arco-design/web-react';
import {useDispatch,useSelector} from 'react-redux';
import { updateTrainingConfig, updateTrainingConfig_basic, updateTrainingConfig_more } from '../../redux/action/training';
import { disabledInput } from '../../redux/action/training';
import { createModel, getNextQuery, gets_cluster } from '../../network/request';
import { updateCsvs } from '../../redux/action/csvs';
import { setTreesMd5 } from '../../redux/action/treesMd5';
import { Popconfirm } from '@arco-design/web-react';
import {DraggableModal} from 'ant-design-draggable-modal';
import {QuestionCircleOutlined} from '@ant-design/icons';
import 'ant-design-draggable-modal/dist/index.css'
import { Popover } from 'antd';
const FormItem = Form.Item;

export default function ConfigView() {
    const [form] = Form.useForm();
    const training = useSelector(state => state.training);
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    function onSubmitHandler(value) {
        // 清除表格
        dispatch({type:'clearSample'})
        // 清除柱状图信息
        dispatch({type: 'clearChart'});
        document.querySelector('.current-chart').innerHTML = '';
        document.querySelector('.cluster-main').innerHTML = '';
        // 清除所有约束
        dispatch({type:'clearAllConstrains'})  
        // 清除md5
        dispatch({type:'clearTreesMd5'})
        dispatch({type: 'clearNodes'})
        // 清除历史所有csvs
        dispatch({type: 'clearHistoryCsvs'});
        
        if (
        ("DRMethod" in value && "clusterMethod" in value)||
        ("DRMethod" in training 
        && "clusterMethod" in training
        &&training.DRMethod
        &&training.clusterMethod)) {
            // 存储主输入面板的输入参数
            dispatch(updateTrainingConfig(value));
            // 禁用参数输入
            dispatch(disabledInput());
            // 折叠面板
            setVisible(false);
            // 创建模型
            createModel(value,request_cluster_data,request_md5_data);
        } else {
            Message.error({
                content: 'Please input DRMethod and clusterMethod!',
            });
        }
    }

    // 请求 固定的cluster 数据
    const request_cluster_data = (data) => {
        gets_cluster(
        (msg) => {
            dispatch(updateCsvs(msg));
        },
        data
        );
    };

    // 请求 获取初始md5
    const request_md5_data = (data) => {
        getNextQuery(
            (val) => {
                dispatch(setTreesMd5(val));
            },
            data
        );
    }


    return (
        <div className=''>

        <div className="summary-title">
                Model Config View
        </div>
        <br />
        <Form
            className="input-form"
            form={form}
            autoComplete='off'
            style={{width: 500,marginLeft:'1.2rem'}}
            validateMessages={{
                required: (_, { label }) => {
                    if (label === 'datasetName')
                        return '必填数据集';
                    if (label === 'queryStrategy')
                        return '必填查询策略';
                    if (label === 'trainStrategy')
                        return '必填训练策略';
                    return `必填${label}`
                } 
              }}
            onValuesChange={(v, vs) => {
                // console.log("change: ",v, vs);
              }}
            onSubmit={onSubmitHandler}
        >
            <FormItem label='DataSet' field='datasetName' rules={[{ required: true }]} disabled={training.disabled}>
                            <Select
                            style={{ width: 230 }} 
                            placeholder='DataSet' 
                            options={[
                            {
                                label: 'DS1',
                                value: 'DS1',
                            },
                            {
                                label: 'DS2',
                                value: 'DS2',
                            },
                            {
                                label: 'DS3',
                                value: 'DS3',
                            },
                            {
                                label: 'DS4',
                                value: 'DS4',
                            }
                            ]}
                            allowClear
                        />
            </FormItem>
            <FormItem label='Querying' field='queryStrategy' rules={[{ required: true }]} disabled={training.disabled}>
                    <Select
                    style={{ width: 230 }} 
                    placeholder='Querying strategy'  
                    options={[
                    {
                        label: 'dataAugmentation',
                        value: 'dataAugmentation',
                    },
                    {
                        label: 'relativeJaccard',
                        value: 'relativeJaccard',
                    },
                    {
                        label: 'uncertainty',
                        value: 'uncertainty',
                    },
                    ]}
                    allowClear
                    />
                </FormItem>
                {/* CC、HC、CC+RD、HC+RD */}
                <FormItem label='Training' field='trainStrategy' rules={[{ required: true }]} disabled={training.disabled}>
                <Select
                    style={{ width: 230}} 
                    placeholder='Training Strategy' 
                    options={[
                    {
                        label: 'CC',
                        value: 'CC',
                    },
                    {
                        label: 'HC',
                        value: 'HC',
                    },
                    {
                        label: 'CC+RD',
                        value: `CC+RD`,
                    },
                    {
                        label: 'HC+RD',
                        value: `HC+RD`,
                    },
                    ]}
                    allowClear
                    />
                </FormItem>
                <FormItem label='Iteration' field='numOfIterations' rules={[{ type: 'number', required: true }]} disabled={training.disabled}>
                    <InputNumber max={500} min={1} placeholder='Number of iteration rounds' style={{ width: 230,height: 35 }}  />
                </FormItem>
                <FormItem label='Pairs' field='numOfSamplePairs' rules={[{ type: 'number', required: true }]} disabled={training.disabled}>
                    <InputNumber max={500} min={1} placeholder='Number of sample pairs' style={{ width: 230,height: 35 }}  />
                </FormItem>
            {visible&&(<div className={classes['hidden-input']}>
                    <FormItem 
                    label='DR'
                    field='DRMethod' 
                    rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='DRMethod' 
                            options={[
                            {
                                label: 'tsne',
                                value: "tsne",
                            },
                            {
                                label: "umap",
                                value: "umap",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem>
                        {/* 选择聚类方法 */}
                        <FormItem label='Cluster' field='clusterMethod' rules={[{ required: true }]} disabled={training.disabled}> 
                            <Select
                            style={{ width: 230 }} 
                            placeholder='clusterMethod' 
                            options={[
                                {
                                    label: "kmeans",
                                    value: "kmeans"
                                },
                                {
                                    label: 'gmm',
                                    value: "gmm",
                                },
                                {
                                    label: 'agg',
                                    value: "agg",
                                },
                            ]}
                            allowClear
                            />
                        </FormItem>

                    <FormItem 
                    label='hold1'
                    field='hold1' 
                    // rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold1' 
                            options={[
                            {
                                label: '1',
                                value: "1",
                            },
                            {
                                label: "2",
                                value: "2",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem>
                        {/* 选择聚类方法 */}
                        <FormItem label='hold2' field='hold2'  disabled={training.disabled}> 
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold2' 
                            options={[
                                {
                                    label: "kmeans",
                                    value: "kmeans"
                                },
                                {
                                    label: 'gmm',
                                    value: "gmm",
                                },
                                {
                                    label: 'agg',
                                    value: "agg",
                                },
                            ]}
                            allowClear
                            />
                        </FormItem>

                        <FormItem 
                    label='hold3'
                    field='hold3' 
                    // rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold3' 
                            options={[
                            {
                                label: 'tsne',
                                value: "tsne",
                            },
                            {
                                label: "umap",
                                value: "umap",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem>
                        {/* 选择聚类方法 */}
                        {/* <FormItem label='hold4' field='hold4' rules={[{ required: false }]} disabled={training.disabled}> 
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold4' 
                            options={[
                                {
                                    label: "kmeans",
                                    value: "kmeans"
                                },
                                {
                                    label: 'gmm',
                                    value: "gmm",
                                },
                                {
                                    label: 'agg',
                                    value: "agg",
                                },
                            ]}
                            allowClear
                            />
                        </FormItem> */}
                        {/* <FormItem 
                    label='hold4'
                    field='hold4' 
                    // rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold4' 
                            options={[
                            {
                                label: 'tsne',
                                value: "tsne",
                            },
                            {
                                label: "umap",
                                value: "umap",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem>
                        <FormItem 
                    label='hold5'
                    field='hold5' 
                    // rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold5' 
                            options={[
                            {
                                label: 'tsne',
                                value: "tsne",
                            },
                            {
                                label: "umap",
                                value: "umap",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem>
                        <FormItem 
                    label='hold6'
                    field='hold6' 
                    // rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold6' 
                            options={[
                            {
                                label: 'tsne',
                                value: "tsne",
                            },
                            {
                                label: "umap",
                                value: "umap",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem>
                        <FormItem 
                    label='hold7'
                    field='hold7' 
                    // rules={[{  required: true }]}
                    disabled={training.disabled}
                    >
                            <Select
                            style={{ width: 230 }} 
                            placeholder='hold7' 
                            options={[
                            {
                                label: 'tsne',
                                value: "tsne",
                            },
                            {
                                label: "umap",
                                value: "umap",
                            },
                            ]}
                            allowClear
                            />
                        </FormItem> */}
            </div>)}
        <FormItem
            wrapperCol={
                {
                    offset: 1,
                }
            }
        >
                <Button 
                className={classes['run-model-button']}  
                type='submit' 
                htmlType='submit' 
                disabled={training.disabled}
                >
                RunModel
                </Button>

                <Button
                className={classes['more-button']}
                onClick={() => {
                    if (visible) {
                        setVisible(false);
                    } else {
                        setVisible(true);
                    }
                }}
                >
                More
                </Button>
                
                <Popconfirm
                focusLock
                title='Are you sure you want to reset?'
                onOk={() => {
                form.resetFields();
                }}
                okText="YES"
                cancelText="NO"
                onCancel={() => {
                
                }}
                disabled={training.disabled}
                >
                <Button
                disabled={training.disabled}
                className={classes['reset-button']}
                >
                Reset
                </Button>
                </Popconfirm>
            </FormItem>
        </Form>
        </div>
    );
}