import React,{PureComponent} from 'react';
import {Form,Button,Input,Row,Divider, Select,Col,Tooltip}from 'antd';
import emitter from "./util/events";
import './GPU_view.css'

const {Option}=Select;
class GPUConfig extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            gpuNames:[]
        }
      }
    formRef =React.createRef();
    //获取后端数据
    componentDidMount(){
        this.eventEmitter1=emitter.addListener(
            'sendGPUs',(gpuNames)=>{
                this.setState({gpuNames});
                // console.log('test>>>>>>>>>>>',this.state.gpuNames)
            }
        )
        this.props.onRef(this);

    }   
    formFinished=()=>{
        // console.log('>>>start gpuformFinish>>>')
        this.formRef.current.submit();
    }
    gpuformFinished=(e)=>{
        const resource={};
        for(var config in e){
            // console.log()
            resource[config.split('+')[1]]={
                            gpu_name:`${config.split('+')[1]}`,
                            memory_fraction:Number(e['memory_fraction'+'+'+config.split('+')[1]]),
                            allow_growth:e['allow_growth'+'+'+config.split('+')[1]],
                            assigned_memory:Number(e['assigned_memory'+'+'+config.split('+')[1]]),
                   }
            }
        console.log('>>>>>>>>',resource)
        this.props.onFinish(resource);
    }

    inputType=(label,gpuName)=>{
        if(label==='memory fraction'){
            return(<Input key={gpuName+label} type='number'/>)
        }
        else if(label==='assigned memory'){
            return(<Input key={gpuName+label} type='number'/>)
        }
        else{
            return(
                <Select name={gpuName+label}>
                    <Option value={true}>True</Option>
                    <Option value={false}>False</Option>
                </Select>
            )
        }
    }
    inputtypetoolTip=(itemtype)=>{
        switch(itemtype){
            case 'memory fraction':
                return(<Tooltip  visible={true} placement='topLeft' title='input int number!'/>);
                break;
            case 'assigned memory':
                return(<Tooltip visible={true} placement='top' title='input float number!'/>);
                break;
            default:
                return(<Tooltip visible={true} placement='bottom' title='Please choose a option!'/>);
        }
      };
    gpuConfig=(data)=>{
        const gpuitems=[];
        const itemlabels=['memory fraction','allow growth']
        const itemNames =['memory_fraction','allow_growth']
        
            for(let i=0;i<data.length;i++){
            gpuitems.push(
                <Divider orientation='left' key={'divider'+data[i].gpuName}>{data[i].gpuName}</Divider>
            )
            for(var item in itemNames){
                gpuitems.push(
                    <Col span={12} key={data[i].gpuName+ item +'col'}>
                        <Form.Item 
                                    name={itemNames[item]+'+'+data[i].gpuName}
                                    label={itemlabels[item]}
                                    rules={[{required:true,
                                             message:(this.inputtypetoolTip(itemlabels[item]))}]}>
                                            {this.inputType(itemlabels[item],data[i].gpuName)}
                                             </Form.Item>
                    </Col>
                )
            }
            gpuitems.push(
                <Col span={12} key={'assignedMemoryitemcol'+i}>
                    <Form.Item  
                                style={{marginTop:'6px'}}
                                name={'assigned_memory'+'+'+data[i].gpuName}
                                label={'assigned memory'}
                                rules={[{required:true,
                                         message:(this.inputtypetoolTip('assigned memory'))}]}>
                                             {this.inputType('assigned memory',data[i].gpuName)}
                                         </Form.Item>

                </Col>
            )
        }
        return gpuitems;
    }
    render(){
        return(
            // this.gpuConfig(this.state.gpuNames)
            <Form
                layout={'inline'}
                name={'gpuForm'}
                initialValues={{remember:true}}
                onFinish={this.gpuformFinished}
                ref={this.formRef}
            >
                <Row gutter={24} key='rowgpuitem'>{this.gpuConfig(this.state.gpuNames)}
                </Row>
            </Form>

        );
    }

}
export default GPUConfig;