
import "antd/dist/antd.less";

import classes from './App.module.css';
import "./App.less";
// 左侧输入+迭代信息
import Summary from './components/Part1-left/Summary';
import DistributionView from './components/Part2-mid/DistributionView';
// 右侧可视化面板
import DetailView from './components/Part3-right/DetailView';
// 布局
import { Layout } from '@arco-design/web-react';
import {DraggableModalProvider } from 'ant-design-draggable-modal'
import {notification} from 'antd';
import { MessageOutlined } from '@ant-design/icons'
import { useEffect} from 'react';
import Joyride from 'react-joyride';
// import 'default-passive-events'
const Sider = Layout.Sider;
const Content = Layout.Content;

export default function App(){
  
    const steps = [
      // 输入
      {
        target: '.config-view',
        content: (
          <div>
            <h2>【指引教程】</h2>
            <p>不需要此教程可点击左下角skip跳过。</p>
            <p>在此处输入训练参数，并点击RunModel开始训练模型。</p>
            <p>注：加载模型需要一段时间，请耐心等待。</p>
          </div>
        ),
      },
      // current Chart & history Chart
      {
        target: '.ModelIterationView',
        content: '在此处查看当前轮和历史轮的[Group-数量]直方图。',
      },
      {
        target: '.extendAllGraphs',
        content: '点击展开历史所有训练轮数的直方图和聚类图。',
      },
      // table
      {
        target: '.pair-list',
        content: '在此处查看当前轮和历史轮的约束选择信息。',
      },
      // cluster
      {
        target: '.current-cluster',
        content: '在此处查看当前轮的聚类图示。',
      },
      {
        target: '.refreshCluster',
        content: '点击此处刷新聚类图示。',
      },
      {
        target: '.vis-pair1',
        content: '此处显示FCTree图示。',
      },
      {
          target: '.step1',
          content: '如果相似，则选择Must。',
      },
      {
          target: '.step2',
          content: '如果不相似，则选择Cannot。',
      },
      {
          target: '.step3',
          content: '尝试选择节点并添加相似约束，注意只能添加连通子树哦！',
      },
      {
          target: '.step4',
          content: '点击展开面板，展开后可放大FCTree。',
      },
      {
          target: '.step5',
          content: (
              <div>
                  <p>点击此按钮可以刷新FCTree，清除选择的约束。</p>
              </div>
          ),
      },
      {
        target: '.up-button',
        content: '点击切换到上一题。',
      },
      {
        target: '.down-button',
        content: '点击切换到下一题。',
      },
      {
        target: '.submitAll',
        content: (
          <div>
              <p>一轮所有题目完成后点击提交所有约束。</p>
              <p><a href="https://www.bilibili.com/video/BV1Ld4y1L7Ui" target='_blank'>➩【具体操作点击此处查看详细指导】</a></p>
          </div>
      )
      },
  ];

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    // api.info({
    //   message: <div className='notification-message'>version 3.3 更新通知</div>,
    //   description: (
    //     <div className='notification-description'>
    //       <p>1. 新增指引功能; </p>
    //       <p>2. 表格布局优化; </p>
    //       <p>3. 历史Chart绘制优化;</p> 
    //       <p>4. 添加单独的历史某轮柱状图显示;</p> 
    //       <p>5. 异步请求逻辑修改;</p> 
    //       <p>6. DS2时Group识别出错的bug修复;</p> 
    //       <p>7. 强制刷新按钮的bug修复;</p> 
    //       <p>8. FCTree展开面板不同步更新bug修复;</p> 
    //       <p>9. 修复Group显示undefined的bug修复;</p> 
    //       <p>Email: feijianghan@gmail.com</p>
    //     </div>
    //   ), 
    //   placement: 'top',
    //   icon: <MessageOutlined/>,
    //   duration: 1,
    //   className: 'notification'
    // });
  };

  // useEffect(()=>{
  //   openNotification();
  // },[]);

  return (
    <DraggableModalProvider>
        {contextHolder}
        <Layout style={{ height: '100vh' }} className={classes.layout}>
            <Sider style={{ width: '384px'}} className={classes.content1} >
              <Summary/>
            </Sider>
            <Sider style={{ width: '859px' }} className={classes.content2}><DistributionView/></Sider>
            <Content style={{ width: '95%' }}  className={classes.content3}><DetailView/></Content>
        </Layout>
        {/* <Joyride 
            steps={steps} 
            disableOverlayClose={true}
            continuous={true}
            showSkipButton={true}
            styles={{
                options: {
                  arrowColor: '#e3ffeb',
                  primaryColor: '#000',
                  width: 450,
                  borderRadius: '12px',
                  zIndex: 1000,
                }
              }}
            />  */}
    </DraggableModalProvider>
  );
}
