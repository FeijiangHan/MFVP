import Cluster from '../distribution/cluster';
import PubSub from 'pubsub-js';
import './DistributionView.css'
import {ReloadOutlined} from '@ant-design/icons'
import PairListView from './PairListView';
import { useSelector } from 'react-redux';

export default function DistributionView() {
  const training = useSelector(state => state.training);
  return (
    <div className="cluster-show column">
      <PairListView/>
      <div className='current-cluster'>
        <div className="summary-title">
          Group Distribution View
          <ReloadOutlined className='refreshCluster' onClick={()=>{PubSub.publish("reloadCluster",true)}} style={{marginLeft: '1rem'}}/>
        </div>
        {"DRMethod" in training 
        && "clusterMethod" in training
        &&training.DRMethod
        &&training.clusterMethod
        &&(<div className='cluster-details'>
          <span>聚类方法：{training.DRMethod}</span>
          <span>降维方法：{training.clusterMethod}</span>
        </div>)}
        <Cluster/>
      </div>
    </div>
  );
}