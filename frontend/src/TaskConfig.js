import React from 'react';
import {Form,Button,Input,Col}from 'antd';
import emitter from "./util/events";
import './GPU_view.css'
import Item from 'antd/lib/list/Item';

class TaskConfig extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            // gpuNames:[]
            configName:'',
            tasknumconfig:[],
            
        }
      }
    formRef =React.createRef();
    //获取后端数据
    componentDidMount(){
        this.eventEmitter1 = emitter.addListener(
            'changeconfigName',(configName)=>{
                this.setState({configName:configName})            
            });
        //绑定
        this.props.onRef(this);
    }
    formFinished =()=>{
        // console.log('>>>start send taskconfig>>>')
        this.formRef.current.submit();
    }
    formtaskFinished=(e)=>{
        console.log('finished>>>>>>>>',e);
        const topconfig= {};
        for(var config in e){
            topconfig[config.split('+')[1]]= Number(e[config]);
            topconfig['t_s']={
                task:config.split('+')[0].split(' / ')[0],
                solution:config.split('+')[0].split(' / ')[1],
            }
        }
        this.setState({tasknumconfig:topconfig});
        this.props.onFinish(this.state.tasknumconfig);
    }
    render(){
        return( 
            <Form
            style={{marginTop:'16px'}}
            key='taskForm'
            ref={this.formRef}
            layout={'inline'}
            name={'taskform'}
            initialValues={{remember:true}}
            onFinish={this.formtaskFinished}
            >
            <Col span={12} key='taskCol'>
                <Form.Item
                    label='task num'
                    name={this.state.configName+'+'+'task_num'}
                    rules={[{required:true,message:'please input numbers!'}]}>
                <Input key={'inputtasknum'} />
                </Form.Item>
                </Col>
                <Col span={12} key='pertasksizeCol'>
                <Form.Item
                    label='per task size'
                    name={this.state.configName+'+'+'pertask_size'}
                    rules={[{required:true,message:'please input numbers!'}]}>
                 <Input key={'inputpertasksize'}/>      
                </Form.Item>
                </Col>
            </Form>
        );
    }

}
export default TaskConfig;