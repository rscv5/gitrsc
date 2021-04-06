import React from 'react';
import {Card,Divider} from 'antd';
import GPUView from './GPU_view';
import TrainResult from './TrainResult';
import './GPU_view.css'

class ThirdLayout extends React.Component{
    render(){
        return(
            <Card title="Show" className='gpuview-card' >
                <GPUView key={'testwebsocket'}/>
                <Divider orientation='left'>Train Result</Divider>
                <TrainResult key={'testresult'}/>

            </Card>
        )
    }
}
export default ThirdLayout;