import {Input} from 'antd'
import './index.less'

import {useState} from 'react'
export default function ShowSet(){
    const [scale, setScale] = useState(50);
    const [familyScale, setFamilyScale] = useState(50);
        return (
            <div className='cluster-show-set'>
                <div className='info'>
                    <div>Display up to <Input value={scale}  size="small"/> % of the Sample globally</div>
                    <div>Display up to <Input value={familyScale}  size="small"/> % of the Sample per family</div>
                </div>
                <div className='legend'>
                    {/* 先不加 */}
                </div>
            </div>
        )
}
