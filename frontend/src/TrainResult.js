import React from 'react';
import {Card} from 'antd';
import emitter from './util/events';
import createG2 from 'g2-react';





const Line = createG2(chart =>{
    chart.col('round',{
        alias:'round', //改变坐标标签值
        nice:false,
        type:'linear',
        range:[0,1]
    })
    chart.legend({
        position:'right',
    })
    chart.tooltip('value*round',{
        shared:true,
        // showTitle:true,

    })
    chart.line().position('round*value').color('name').shape('spline').size(2.5)
    chart.render();

})


var allLoss ={};
var allValAcc={};
var allValLoss={};
var xstep =0;
let resultnumbers =0;
const tabListTitle =[
    { 
        key:'allLoss',
        tab:'Loss',
    },
    {
        key:'allValAcc',
        tab:'Val Accuracy',
    },
    {
        key:'allValLoss',
        tab:'Val Loss',
    }
]


class TrainResult extends React.Component{
    state={
        data:allLoss,
        nowtitleKey:'allLoss',
        width:450,
        // autoFit:true,
        forceFit:true,
        height:450,
        plotCfg:{
            // margin:[10,100,50,20],
            background:{
                stroke:'#ccc',
                lineWidth:1,//边框粗细
            }
        },
        resultsData:[],
    }

        //获取数据
        componentDidMount(){
            this.eventEmitter1 = emitter.addListener(
                'sendResults',(resultsData)=>{
                    this.setState({resultsData})
                }
            )
            // this.connection = new WebSocket('ws://127.0.0.1:8182/worker_status');
            // this.connection.onopen=()=>{
            // console.log('Connect results open...')
            // }
            // this.connection.onmessage = (evt) =>{
                // console.log('results>>>>',JSON.parse(evt.data));
            // this.setState({dataSource:JSON.parse(evt.data).gpu_status,resultSource:JSON.parse(evt.data).results})
            //     this.setState({resultsData:JSON.parse(evt.data).results})
            // console.log('sta>>>>>>>>>',this.state.dataSource);
            // emitter.emit('sendResults',this.state.resultSource.results);
        // };
        }
        //tabChange
        onTabChange=(key,type)=>{
            console.log('onTabChange>>>>>>>>',key,type);
            this.setState({[type]:key},function(){
                console.log('this.nowtitleKey',this.state.nowtitleKey);
                switch(this.state.nowtitleKey){
                        case 'allLoss':
                            this.setState({data:allLoss},function(){console.log('Lossdata>>>>>>>',this.state.data)})
                            break;
                        case 'allValAcc': 
                            this.setState({data:allValAcc},function(){console.log('ValAccdata>>>>>>>',this.state.data)});
                            break;
                        case 'allValLoss':
                            this.setState({data:allValLoss},function(){console.log('ValLossdata>>>>>>>',this.state.data)})
                            break;
                        default: break;
                
                }
            });       
        }
        //获取row数据
        getrowData=(resultsData)=>{
            // console.log('结果数:',resultsData.length);
            // 结果数
            if(resultsData!==undefined){
                resultnumbers = resultsData.length;
            for(var key in resultsData){
                // console.log('每一结果参数:',resultsData);
                //step x:
                const xnew = resultsData[key].scalar_dict.Loss.length;
                if(xstep < xnew){xstep=xnew};
                //三个参数拿取 第一个 Loss  Val_Accuracy  Val_Loss：
                allLoss[key]=resultsData[key].scalar_dict.Loss;
                allValAcc[key]=resultsData[key].scalar_dict['Val Accuracy'];
                allValLoss[key]=resultsData[key].scalar_dict['Val Loss'];
            }
            // this.setState({getData:true});
            // console.log('<<<<<<<<<<<<<<<<<<<',allLoss);
        }
        }
        //转换为SeriesData
        getSeriesData=(data)=>{
            // console.log('dda???????',data);
            var series=[];      
            for(var key in data){
                series.push(                    
                 data[key].map((value,i)=>({round:i+1,value:value,name:'实验'+`${key}`}))
                 )
                const s0 =series[0];
                var finaldata= s0.concat(series[key]===data?null:series[key]) 
                
            }
            return finaldata;
        }

    render(){
        this.getrowData(this.state.resultsData);
        const Data =this.getSeriesData(this.state.data)
 
        return(
            <Card
            style={{height:550}}
            tabList={tabListTitle}
            activeTabKey={this.state.nowtitleKey}
            onTabChange={key=>{this.onTabChange(key,'nowtitleKey');}}
           >
            
            <div>
            <Line
                data={Data}
                height={this.state.height}
                width={this.state.width}
                forceFit={this.state.forceFit}
                plotCfg={this.state.plotCfg}/>
            </div>

            </Card>
            )
    }
}

export default TrainResult;