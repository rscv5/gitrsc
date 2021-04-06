import { Col, Row, Form, Input, Button, Empty,Space,Card, Collapse, Tooltip, Select, Layout, notification } from 'antd';
import React from 'react';
import { MinusCircleOutlined,UpOutlined,DownOutlined } from '@ant-design/icons'; 
import GPUConfig from './GPUConfig';
import TaskConfig from './TaskConfig';
import emitter from './util/events';
import './ParaSet.css';
import Cookies from 'js-cookie';
const{Panel} = Collapse;
const{Option} = Select;
var changeConfig={};
var selectedOption=[];
const csrftoken = Cookies.get('CSRF-TOKEN');

class CustomconfigForm extends React.Component{
    constructor(props){
        super(props);
        this.state={

            selectedOption:[],
        }
    }
    formRef = React.createRef();
    componentDidMount(){
        //组件装载完成以后声明一个自定义事件
        //此处以csonconfig为例 获取了consonfig
        this.eventEmitter1 = emitter.addListener(
            'changeconfigName',(configName)=>{
                this.setState({selectedOption:[]});            
            }
        )
        this.props.onRef(this);

    }
    getchildconfig=(data)=>{
        // console.log('custom>>>>>>>>>>',data);
        const children =[];
        //获取select children
        for(var key in data){
            if(typeof data[key].children === 'object' && Object.keys(data[key].children).length>0){
                data[key].children.forEach(item=>{
                    children.push(<Option key={item.label} value={item.value_type==='bool'?[item.value]:item.label+'/'+item.value} 
                                          value_type={item.value_type}>
                                        {item.label}
                                    </Option>)
                })
            }
        }
        return children;
    }
    handleChange=(value,option)=>{
        option.map((item)=>{
            console.log('option.item',item)
        })
        this.setState({selectedOption});

    }
    changeInput =(event)=>{
        changeConfig[event.target.id]={
                                       name:event.target.id,
                                       value:event.target.value,
                                       type:'Custom Config'};
    }
    inputType=(itemtype,configValue,configName)=>{
        // console.log('>>>>>>>>>>>>>>>>>>',configValue);
        if(itemtype ==='bool'){
            const changeSelect=(value)=>{
                const boolvalue = value.toString().split(',');
                if(boolvalue.length>1){
                changeConfig[configName] ={
                    name:configName,        
                    value:boolvalue[0]+'/'+boolvalue[1],
                    type:'Custom Config'};}
                else{changeConfig[configName]={
                    name:configName,
                    value:boolvalue[0],
                    type:'Custom Config'}}
            }
        return(
            <Select name={configName} defaultValue={configValue} mode='multiple' onChange={(value)=>changeSelect(value)}>
                <Option value={true}>true</Option>
                <Option value={false}>false</Option>
            </Select>)
        }
        else{
            return(<Input value={configValue} key={configName+configValue} id={configName}  type='string' onChange={this.changeInput} allowClear/>)
        }
    }
    inputtypetoolTip=(itemtype)=>{
        switch(itemtype){
            case 'int':
                return(<Tooltip  visible={true} placement='bottomLeft' title='input int number!'/>);
            case 'float':
                return(<Tooltip visible={true}placement='bottom' title='input float number!'/>);
            default:
                return(<Tooltip visible={true} placement='bottom' title='input something!'/>);
        }
    };
    handleSelect=(item)=>{
        // const {getFieldDecorator}= this.props.form;
        if(item.value_type!=="bool"){
            item.value=item.value.split("/")[1];
        }
        else{
            item.value=item.value.toString();
        }
        //单个字典
        selectedOption.push(
        //   selectedOption.key={item.key},
          <Space align='baseline' key={item.key} className='col-formItem'>
                <Form.Item  
                            // key={item.key}
                            name={item.key}
                            label={item.key}
                            initialValue={item.value}
                            // initialvalues={item.value}
                            rules={[{
                                    required:true,
                                    message:(this.inputtypetoolTip(item.value_type)),
                            }]}>
                                {this.inputType(item.value_type,item.value,item.key)}
                </Form.Item> 
                <MinusCircleOutlined onClick={()=>this.remove(item.key)}/>
            </Space>
        )
        this.setState({selectedOption});
    }
    remove =(key)=>{
      const changeform = changeConfig;
      const form = this.state.selectedOption;
      for(let index in form){
        if(key === form[index].key){
            form.splice(index,1);
            break;
        }
      }
      delete changeform[key];
      this.setState({selectedOption:form});
      changeConfig=changeform;
    };
    formFinished = ()=>{ 
        // console.log('start>>>>>>')
        this.formRef.current.submit();
    }
    formcustomFinished =(e)=>{
        // console.log('finished',e);
        for(var k in e){
            var item= e[k];
            if(typeof item ==='object'){
                continue;
            }
            else{
            e[k]=[item];}
        }
        // console.log('>>>>>>>>>>',e)
        this.props.onFinish(e);
    }
    render(){
        return(
            <Layout key='testselectConfig'>
                <Row className='col-customConfig'>
                    <Select
                        className='select-customConfig'
                        allowClear
                        // labelInValue={true}
                        style={{width:'100%'}}
                        placeholder='please select'
                        onSelect={(value,option)=>this.handleSelect(option)}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            // console.log('input',input,'options>>>>>',option)}
                        >
                            {this.getchildconfig(this.props.configform)}
                        </Select>
                </Row>
                <Row gutter={24} className='step-content'>
                    <Form ref={this.formRef} layout='vertical' name='Custom ConfigForm'                  
                        onFinish={this.formcustomFinished}  
                        forceRender={true}>
                        {/* {this.formcustomFinished} */}
                    <Row gutter={24} key='selectedoptionRow'>{this.state.selectedOption}</Row>
                    {/* {this.showdoneButton(this.state.selectedOption)} */}
                    </Form> 

                </Row>
            </Layout>
        )
    }
}
class ConfigForm extends React.Component{
    constructor(props){
      super(props);
      this.state ={
          expand:false,
          setExpand:false,
      };
    }
    formRef = React.createRef();
    inputtypetoolTip=(itemtype)=>{
      switch(itemtype){
          case 'int':
              return(<Tooltip  visible={true} placement='bottomLeft' title='input int number!'/>);
            //   break;
          case 'float':
              return(<Tooltip visible={true}placement='bottom' title='input float number!'/>);
            //   break;
          default:
              return(<Tooltip visible={true} placement='bottom' title='input something!'/>);
      }
    };
    changeInput =(event)=>{
      changeConfig[event.target.id]={
        name:event.target.id,  
        value:event.target.value,
        type:this.props.configFormName};
    }
    inputType=(itemtype,configValue,configName)=>{
      if(itemtype ==='bool'){
          const changeSelect=(value)=>{
              const boolvalue=value.toString().split(',');
              if(boolvalue.length>1){
                changeConfig[configName] ={
                    name:configName,
                    value:boolvalue[0]+'/'+boolvalue[1],
                    type:this.props.configFormName};
              }
              else{
                  changeConfig[configName]={
                      name:configName,
                      value:boolvalue[0],
                      type:this.props.configFormName
                  }
              }

          }
      return(
          <Select name={configName} defaultValue={configValue} mode='multiple' onChange={(value)=>changeSelect(value)}>
              <Option value={'True'}>True</Option>
              <Option value={'False'}>False</Option>
          </Select>)
      }
      else{
          return(<Input value={configValue} id={configName}  type='string' onChange={this.changeInput} allowClear/>)
      }
  }
  
    getFields =(data)=>{
      var count = data.length;
      if(data.length < 9 ){ 
          count = data.length}
      else{ 
          count = this.state.expand ? data.length : 9; 
      }
      const children = [];
      for(let i=0; i<count;i++){
          if(data.length!==0){
              children.push(
                  <Col span={8} key={i}>
                      <Form.Item name={data[i].label}
                                  label={data[i].label}
                                  initialValue={data[i].value}
                                  rules={[{required:true,
                                          message:(this.inputtypetoolTip(data[i].value_type)),
                                  }]}
                                  >
                                  {this.inputType(data[i].value_type, data[i].value,data[i].label)}
                                  </Form.Item>
                  </Col>
              );
          }}
          if(data.length === 0){
              children.push(
                  <Empty  style={{ marginLeft:'80%'}} />
              )
          }
          return children;
    }
    showdoneButton=(data)=>{
      if(data.length > 12){
          return(
          <Row>
          <Col span={24} style={{textAlign:'right'}}>
          <a style={{fontSize:12}} onClick={() =>{this.setState({expand:!this.state.expand});}}>{this.state.expand? <UpOutlined/>:<DownOutlined/>}Collapse</a>
          <Button htmlType='submit'>Done</Button>                 
           </Col>
          </Row>
          )
      }
      else if(data.length !==0){
          return(
              <Row>
              <Col span={24} style={{textAlign:'right'}}>
              <Button htmlType='submit' >Done</Button>                 
              </Col>
              </Row>
              )
      }
      else return null;
    }
    //接收父组件传来的函数，调用并传递给父组件
    formFinished=(e)=>{
      // console.log('finished',e);
       for(var k in e){
              var item= e[k];
              if(typeof item ==='object'){
                  continue;
              }
              else{
              e[k]=[item];}
          }
          this.props.onFinish(this.props.configFormName,e);
      }
  
    render(){
      return(
          <Row gutter={24} className='step-content'>
              <Form ref={this.formRef} layout='vertical' name='Train configForm' onFinish={this.formFinished}>
                  <Row gutter={24}>{this.getFields(this.props.configform)}</Row>
                  {this.showdoneButton(this.props.configform)}
              </Form>
          </Row>   
      );
  }
  }

//用于接收task/core的ConfigForm传参
var Config={
  taskConfig:[],
  coreConfig:[], 
}
// const CustomconfigForm1 = Form.create()(CustomconfigForm)
class ParameterSet extends React.Component{
    //在父组件中设置state，通过在子组件上使用props将其传递到子组件上
    constructor(props){
        super(props);
        this.state = {
            customConfig:{},
            configName:"",
            taskConfig:[],
            coreConfig:[],
            newConfig:{}, //task 与 core config 合集
            getcustomConfig:{},
            taskalloConfig:{task:[]},
            gpualloConfig:{resource:[]},
            task_arg:{},
            // sendcusFlag:false,
        }
    }
    componentDidMount(){
        //组件装载完成以后声明一个自定义事件
        //此处以csonconfig为例 获取了consonfig
        this.eventEmitter1 = emitter.addListener(
            'changeconfigName',(configName)=>{
                this.setState({configName:configName,customConfig:{}})
                changeConfig={};
                selectedOption=[];              
            });
        this.timer = setInterval(()=>{
            if(this.state.configName!==''){
                // console.log('>>>>>>>>>>>>>configName',this.state.configName)
                //注意有空格
                fetch("http://localhost:8000/config/?task="+this.state.configName.split(' / ')[0]+"\&solution="+this.state.configName.split(' / ')[1])
                    .then((res)=> res.json())
                    .then((res)=>{
                        for(var key in res){
                            if(key==='task_core_config'){
                                res[key].map((item)=>{
                                    if(item.value==='Task'){this.setState({taskConfig:item.children})};
                                    if(item.value==='Core'){this.setState({coreConfig:item.children})};
                                });
                            }
                            if(key==='total_config'){this.setState({customConfig:res[key]})}
                   }
                    })
            .catch((e)=>{console.error(e)});
            }},1000);
        this.eventEmitter5=emitter.addListener(
            'sendGPUsconfig',(resource)=>{
                const newGpustate={resource:[]}
                newGpustate.resource=resource;
                this.setState({gpualloConfig:newGpustate});
            }
        )
        
    }
    componentWillUnmount(){
        emitter.removeListener('changeconfigName',(configName)=>{console.log('remove', configName)});
        clearInterval(this.timer);
    }


    onRefCusconfig=(ref)=>{this.CustomconfigForm =ref};

    onRefTaskalloconfig =(ref)=>{this.TaskConfig = ref};

    onRefGPUconfig =(ref)=>{this.GPUConfig = ref};

    getcustomconfig = ()=>{
        this.CustomconfigForm.formFinished();
    }
    sendconfig = ()=>{
    //   console.log('vs>>>>>>>>>>',this.state.newConfig);
      fetch('http://127.0.0.1:8000/getconfig/',{
          //post 提交
          method:'POST',
          headers:{
              // "X-CSRFToken": this.getCookie("csrftoken"),
              "Content-type":'application/json',
               "Accept": "application/json",
              "X-CSRFToken":csrftoken
          },
          body:JSON.stringify(this.state.newConfig)
      })
      .then(res=>res.json())
      .then(data=>{
          console.log('summitnewConfig',data)
      });
    }
    gettaskallo = ()=>{
        this.TaskConfig.formFinished();
        this.GPUConfig.formFinished();
    }
    run = () =>{
        this.getcustomconfig();
        this.gettaskallo();
        this.sendconfig();
    }
    //从父组件中的函数，接收一个参数,并传给后端
    formcustomFinished=(config)=>{
        this.setState({getcustomConfig:config});
        console.log('getcustomConfig>>>>>>>>>',this.state.getcustomConfig);
        fetch('http://127.0.0.1:8000/getcustomconfig/',{
            //post 提交
            method:'POST',
            // credentials: "same-origin",
            headers:{
              "X-CSRFToken": csrftoken,
               "Accept": "application/json",
              "Content-type":'application/json',
              // "X-CSRFToken":csrftoken,
            },

            body:JSON.stringify(this.state.getcustomConfig)
        })
        .then(res=>res.json())
        .then(data=>{
            console.log('summitcustomConfig',data)
        });
    }
    //从父组件中的函数，接收一个参数
    formFinished=(name,config)=>{
      Config[name]=[config];
      this.setState({newConfig:Config});
      console.log('Config>>>>>>>',this.state.newConfig)
    }
    //从父组件的函数中，接收taskalloc的函数
    formtaskallocFinished=(taskalloConfig)=>{
        const task_args = changeConfig;
        const newTaskstate ={task:[]}
        newTaskstate.task=taskalloConfig;
        newTaskstate.task.task_args = task_args;
        this.setState({taskalloConfig:newTaskstate},function(){
            console.log('>>>>>>>>>>>taskalloc',this.state.taskalloConfig);
        });
    }
    //从父组件的函数中，接收gpuconfig的参数
    formgpuFinished=(gpuconfig)=>{
        const newGpustate = {resource:[]}
        newGpustate.resource=gpuconfig;
        this.setState({gpualloConfig:newGpustate},
        function(){
            console.log('>>>>>>>gpuconfig',this.state.gpualloConfig);
        })
        fetch('http://127.0.0.1:8000/task_post/',{
            //post 提交
            method:'POST',
            // credentials: "same-origin",
            headers:{
               "Accept": "application/json",
              "Content-type":'application/json',
              "X-CSRFToken":csrftoken,
            },
            body:JSON.stringify(Object.assign(this.state.taskalloConfig,this.state.gpualloConfig))
        })
        .then(res=>res.json())
        .then(res=>{
            console.log('summitTaskalloc',res)
        });
    }

    render(){
      const openNotification = placement =>{
        notification.info({
          message: 'Notification about Config setting!',
          description:' 设置config多个值,之间请用"/"分割。',
          placement,
        })
      }
        return(
            <Card className='parasetCard' title={this.state.configName +'Config Setting'}>
                <Collapse accordion defaultActiveKey={['customconfig']} onChange={()=>openNotification('bottomLeft')}>
                    <Panel header='Custom Config ' key='customconfig'>
                        <CustomconfigForm key='customconfigForm'  configFormName='customConfig' configform={this.state.customConfig} 
                        // sendflag={this.state.sendcusFlag}
                        onRef = {this.onRefCusconfig}
                        //  onFinish={this.formcustomFinished(this.state.sendcustomconfigflag)
                        onFinish={this.formcustomFinished} 
                          />
                    </Panel>
                    <Panel header='Core Config' key='coreconfig'>
                        <ConfigForm configFormName='coreConfig' configform={this.state.coreConfig} onFinish={this.formFinished}/>
                    </Panel>
                    <Panel header='Task Config ' key='taskconfig'>
                        <ConfigForm configFormName='taskConfig' configform={this.state.taskConfig} onFinish={this.formFinished}/>
                    </Panel>                  
                </Collapse>
                <TaskConfig key='taskconfig' onRef={this.onRefTaskalloconfig}
                    onFinish={this.formtaskallocFinished}
                    />
                <GPUConfig key='gpuconfig'
                    onRef={this.onRefGPUconfig}
                    onFinish={this.formgpuFinished}
                    />
                <Row key='Run'>
                    <Col span={24} style={{textAlign:'right'}}>
                        <Button htmetype='submit' style={{margin:'16px'}} type='primary'onClick={this.run}>Run</Button>
                    </Col>
                </Row>
            </Card>
        )
}
}
export default ParameterSet;