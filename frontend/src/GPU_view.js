import React from 'react';
import { Table, Progress , Popconfirm}from 'antd';
import emitter from "./util/events";
import './GPU_view.css'




class GPUView extends React.Component{
    constructor(props) {
        super(props);
        this.columns =[
            {
                title:'Name',
                dataIndex:'gpuName',
            },
            {
                title:'Memory Free',
                dataIndex:'gpumemoryFree',
                // sorter:(a,b)=>(a.gpumemoryUsed - b.gpumemoryUsed),
            },
            {
                title:'Memory Total',
                dataIndex:'gpumemoryTotal',
            },
            {
                title:'Action',
                key:'action',
                // sorter:true,
                render:(text, record)=>{
                    // console.log('text=>>>>>>>>',text.key);
                    // console.log('record>>>>>>>>>',record.key);
                    if(this.state.dataSource.length>=1){
                        return(
                        <Popconfirm title="Sure to delete?" onConfirm={()=>this.handleDelete(record.key)}>
                             <a href={'/#'}
                                >Delete</a>
                         </Popconfirm>
                    )}
                    else{return(null)};
                    }
            }
        
        ]
        this.state={
            dataSource:[],
            gpuNames:[],
            resultSource:[],
        }
      }
    //获取后端数据
    componentDidMount(){

        this.connection = new WebSocket('ws://127.0.0.1:8181/worker_status');
        this.connection.onopen=()=>{
            console.log('Connect  gpu open...')
        }
        this.connection.onmessage = (evt) =>{
            // console.log('gpuviewssss>>>',JSON.parse(evt.data));
            this.setState({dataSource:JSON.parse(evt.data).gpu_status,resultSource:JSON.parse(evt.data).results})
            // this.setState({dataSource:JSON.parse(evt.data).gpu_status})
            // console.log('sta>>>>>>>>>',this.state.resultSource);
            emitter.emit('sendResults',this.state.resultSource.results);
        };
    }

    getTabledata=(data)=>{
        // console.log('data<<<<<<<<<<',data);
        const coldata=[];
        const gpunames=[];
        for(var key in data){
            coldata.push({
                key:data[key].gpu_name,
                gpuName:data[key].gpu_name,
                gpuId:data[key].gpu_id,
                gpumemoryTotal:data[key].gpu_memoryTotal,
                gpumemoryFree:data[key].gpu_memoryFree,
                description:<Progress percent={data[key].gpu_memoryUtil.toFixed(2)} 
                                      strokeColor={{from:'#108ee9',to:(data[key].gpu_memoryUtil>80)?'#fa3d3d':'#87d068',}}
                                      size='small'/>
            })
            gpunames.push({gpuName:data[key].gpu_name});
            // console.log('tets<<<<<<<',data[key].gpu_memoryFree)
        }
        emitter.emit('sendGPUs',gpunames);
        return coldata;
    }

    handleDelete =(key)=>{
        console.log(key);
        const dataSource = [...this.state.dataSource];
        dataSource.filter((item)=>console.log(item.gpu_name));
        this.setState({
            dataSource:dataSource.filter((item)=>item.gpu_name!==key),
        });
    }
    render(){
        return(
            // <div></div>
            <Table className='gpuview-table'
                   columns={this.columns}
                   expandable={{
                       expandedRowRender:record=><p style={{margin:0}}>{record.description}</p>,
                       rowExpandable:record=>record.name!=='Not Expandable',
                }}
                dataSource={this.getTabledata(this.state.dataSource)}/>
        );
    }

}
export default GPUView;