import {useEffect} from 'react';
import * as d3v6 from 'd3v6';
import './index.less'
import { create_xy_new } from '../../../assets/static/js/create_xy_new';

export default function Charts({family_data,sample_data,type,space}){
    useEffect(() => {
        let data_1=[];
        let data_2=[];
        for(let i=0;i<family_data.length;i++){
            data_1.push(family_data[i]['weighted']);
            data_2.push(family_data[i]['number']);
        }

        //sample
        let data_3=[]
        for(let i=0;i<sample_data.length;i++){
            data_3.push(sample_data[i][5])
        }
        if (data_2.length > 0 && type==='current') {
            create_xy_new(d3v6,`.${space}`,340,200,family_data,{xTitle:"Group",yTitle:"Number"})
            //create_hist(d3v6,`.${space}`,370,170,data_2,"var",{xTitle:"样本数",yTitle:"Groups"},null);
        } else if (data_2.length > 0 && type==='history') {
            create_xy_new(d3v6,`.${space}`,350,210,family_data,{xTitle:"Group",yTitle:"Number"});
        }
        
    }, [family_data, sample_data, space, type])
   
    return (
        <div className='chart'>
            <div className={space}></div>
        </div>
    )
}