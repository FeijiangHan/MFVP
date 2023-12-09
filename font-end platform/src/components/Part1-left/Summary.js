import React from 'react';
import './Summary.css'
import ConfigView from './ConfigView'
import IterationPanel from './IterationPanel'

export default function Summary(props) {
    return(
        <div className='summary column'>
            <div className='config-view'>
                <ConfigView/>
            </div>
            {/* <Divider/> */}
            <div className='iteration-view'>
                <IterationPanel/>
            </div>
        </div>
    );
}