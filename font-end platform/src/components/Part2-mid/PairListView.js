import './PairListView.css';
import { Tabs, Table, Tag } from "antd";
import { useDispatch,useSelector } from 'react-redux';
import { clearCurrentSample, updateCurrentSample, updateHistorySample } from '../../redux/action/samplePairs';
import { useEffect } from 'react';
import {IconStorage} from '@arco-design/web-react/icon';
import { ConfigProvider,Empty } from 'antd';

const {TabPane} = Tabs;
export default function PairListView(props) {
    const dispatch = useDispatch();
    const tableData = useSelector(state => state.samplePairs);
    const currentData = tableData.current; 
    const historyData = tableData.history;

    const trainingConfig = useSelector(state => state.training);
    const round = trainingConfig.round;
    const pairs = trainingConfig.pairs;

    const iteration = useSelector(state => state.iterations);

    // 获取约束信息
    const constrains = useSelector(state => state.constrains);

    // 获取当前md5
    const md5Set = useSelector(state => state.treesMd5.md5Set);


      let data1 = [];
      let index = 0;

      for (let id in constrains) {
        let group1 = constrains[id].group1 <= 9 ? `G0${constrains[id].group1}` : `G${constrains[id].group1}`;
        let group2 = constrains[id].group2 <= 9 ? `G0${constrains[id].group2}` : `G${constrains[id].group2}`;

        if (!constrains.hasOwnProperty(id)) {
          group1 = '';
          group2 = '';
        }

        data1.push({
          key: index,
          pid: id,
          round: iteration,
          md5: md5Set[id-1][0],
          group: group1,
          must: (constrains[id].isSame === 'init') ? false : constrains[id].isSame,
          cannot: (constrains[id].isSame === 'init') ? false : !constrains[id].isSame,
          similar: constrains[id].similarSubgraph.length,
          unSimilar: constrains[id].dissimilarSubgraph.length,
        },
        {
          key: index+1,
          pid: id,
          round: iteration,
          md5: md5Set[id-1][1],
          group: group2,
        })
        index = index + 2;
      } 

      useEffect(()=>{
        dispatch(updateCurrentSample(data1));
      },[constrains]);
      
      
      const currentColumns = [
        {
          title: 'Pair ID',
          dataIndex: 'pid',
          sorter: (a, b) => a.pid > b.pid,
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          align: 'center', //头部单元格和列内容水平居中
          width: 100,
        },
        {
          title: 'Sample Md5',
          dataIndex: 'md5',
          align: 'center', //头部单元格和列内容水平居中
          height: 50,
        },
        {
          title: 'Group',
          dataIndex: 'group',
          align: 'center', //头部单元格和列内容水平居中
          width: 80,
        },
        {
          title: 'Must',
          dataIndex: 'must',
          render: (must,id) => (
            (must) ? <Tag color={'rgba(119, 124, 192,0.3)'} key={id} style={{fontSize: '1.3rem'}}>✔</Tag> : <Tag style={{display: 'none'}} key={id}>✔</Tag>
          ),
          align: 'center', //头部单元格和列内容水平居中
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 80,
        },
        {
          title: 'Cannot',
          dataIndex: 'cannot',
          align: 'center', //头部单元格和列内容水平居中
          render: (cannot,id) => (
            (cannot) ? <Tag color={'rgba(119, 124, 192,0.3)'} key={id} style={{fontSize: '1.3rem'}}>✔</Tag> : <Tag style={{display: 'none'}} key={id}>✔</Tag>
          ),
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 82,
          
        },
        {
          title: 'Similar',
          dataIndex: 'similar',
          align: 'center', //头部单元格和列内容水平居中
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 80,
        },
        {
          title: 'UnSimilar',
          dataIndex: 'unSimilar',
          align: 'center', //头部单元格和列内容水平居中
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 98,
        },
      ];

      const historyColumns = [
        {
          title: 'Round',
          dataIndex: 'round',
          sorter: (a, b) => a.round > b.round,
          align: 'center', //头部单元格和列内容水平居中
          onCell: (_, index) => ({
            rowSpan: index % (2*pairs) === 0 || index === 0 ? (2*pairs) : 0
          }),
          width: 80,
        },
        {
          title: 'Pair ID',
          dataIndex: 'pid',
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          align: 'center', //头部单元格和列内容水平居中
          width: 77,
        },
        {
          title: 'Sample Md5',
          dataIndex: 'md5',
          align: 'center', //头部单元格和列内容水平居中
        },
        {
          title: 'Group',
          dataIndex: 'group',
          align: 'center', //头部单元格和列内容水平居中
          width: 76,
        },
        {
          title: 'Must',
          dataIndex: 'must',
          render: (must,id) => (
            (must) ? <Tag color={'rgba(119, 124, 192,0.3)'} key={id} style={{fontSize: '1.3rem'}}>✔</Tag> : <Tag style={{display: 'none',color:'grey'}} key={id}>✔</Tag>
          ),
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          align: 'center', //头部单元格和列内容水平居中
          width: 76,
        },
        {
          title: 'Cannot',
          dataIndex: 'cannot',
          align: 'center', //头部单元格和列内容水平居中
          render: (must,id) => (
            (must) ? <Tag color={'rgba(119, 124, 192,0.3)'} key={id} style={{fontSize: '1.3rem'}}>✔</Tag> : <Tag style={{display: 'none'}} key={id}>✔</Tag>
          ),
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 82,
        },
        {
          title: 'Similar',
          dataIndex: 'similar',
          align: 'center', //头部单元格和列内容水平居中
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 79,
        },
        {
          title: 'UnSimilar',
          dataIndex: 'unSimilar',
          align: 'center', //头部单元格和列内容水平居中
          onCell: (_, index) => ({
            rowSpan: index % 2 === 0 || index === 0 ? 2 : 0
          }),
          width: 98,
        },
      ];

    const DialogTitle = 
            <div className="summary-title">
                Sample Pair List View
            </div>

  const customizeRenderEmpty = () => (
    //这里面就是我们自己定义的空状态
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="数据未加载"/>
);
    return (
        <div className='pair-list'>
          <Tabs defaultActiveKey="1" tabBarExtraContent={{'left':DialogTitle}} >
                  <TabPane tab="Current Pairs" key="1">
                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                      <Table 
                          columns={currentColumns} 
                          dataSource={currentData} 
                          bordered 
                          pagination={false} 
                          scroll={{ y: 250 }}
                          rowClassName={null}/>
                    </ConfigProvider>
                  </TabPane>
                  <TabPane tab="Historical Pairs" key="2">
                      <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        <Table 
                        columns={historyColumns} 
                        dataSource={historyData} 
                        bordered 
                        pagination={false} 
                        scroll={{ y: 250 }}
                        rowClassName={null}/>
                      </ConfigProvider>
                  </TabPane>
              </Tabs>
        </div>
    );
}