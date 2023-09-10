import { Button, Form, Select } from '@arco-design/web-react';
import {Modal} from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useState } from 'react';
// import 'MoreInput.css';

export default function MoreInput(props) {
    const [form] = Form.useForm();

    function onSubmitHandler2(value) {
        console.log(value)
    }
    return (
        <Modal
        open={true}
        title="More Parameters"
        footer={null}
        onCancel={()=>props.setVisible(false)}
        >
      <Form
            className="input-form2"
            form={form}
            autoComplete='off'
            style={{width: 500,marginLeft:'1.2rem'}}
            validateMessages={{
                required: (_, { label }) => {
                    if (label === 'DRMethod')
                        return '必填降维方式';
                    if (label === 'clusterMethod')
                        return '必填聚类方式';
                    return `必填${label}`
                }
            }}
            onValuesChange={(v, vs) => {
                
            }}
            onSubmit={onSubmitHandler2}
        >
        <FormItem
                    label='DRMethod'
                    field='DRMethod' 
                    rules={[{  required: true }]}
                    disabled={props.disabled}
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
                        <FormItem label='clusterMethod' field='clusterMethod' rules={[{ required: true }]} disabled={props.disabled}> 
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
                        <Button
                            className={props['run-model-button']}  
                            type='submit' 
                            htmlType='submit' 
                            disabled={props.disabled}
                            >
                            Submit
                        </Button>
      </Form>
    </Modal>
    );
}