import './FCTreePairControl.css';
import { Tabs } from "antd";
import { Icon } from '@arco-design/web-react';
import { IconStorage } from '@arco-design/web-react/icon';
const {TabPane} = Tabs;
export default function FCTreePairControl(props) {
    return (
        <div className="pair-control">
            <div className="summary-header">
                <IconStorage className='icon1'/>
                Control Panel
            </div>

            <Tabs defaultActiveKey="1" tabPosition="left" size="small">
                {/* tab="Setting"  */}
                <TabPane key="1" tab={<span style={{writingMode:'vertical-rl'}}>Setting</span>}>
                    <h2>To be continue...</h2>
                </TabPane>
                <TabPane tab={<span style={{writingMode:'vertical-rl'}}>Similar</span>} key="2">
                <h2>Continue</h2>
                </TabPane>
                <TabPane tab={<span style={{writingMode:'vertical-rl'}}>UnSimilar</span>} key="3">
                <h2>Continue</h2>
                </TabPane>
            </Tabs>
        </div>
    );
}