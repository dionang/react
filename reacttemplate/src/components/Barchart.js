import React, { Component } from 'react';
import request from 'request';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Label, Legend, Tooltip, ResponsiveContainer} from 'recharts';
import ChartForm from './ChartForm';
import JsonProcessor from './JsonProcessor';
import Descriptive from './Descriptive';

class Barchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData:[],
            summaryData:''
        }
    }

    // update state of initialized when props change
    componentWillReceiveProps(nextProps){
        if (nextProps.properties.initialized != this.state.initialized){
            this.setState({initialized: nextProps.properties.initialized});
        }
    }

    // do API call to render chartData upon loading of component from DB
    componentWillMount(){
        let self = this;
        let url = this.props.properties.datasourceUrl;
        let aggregate = this.props.properties.aggregate;
        if (url){
            request.get({
                url: url,
            }, function(error, response, body){
                let data = JSON.parse(body);
                let chartData = data[self.props.properties.dataset];
                let xAxis = self.props.properties.xAxis;
                let yAxis = self.props.properties.yAxis;
                if (aggregate === ""){
                    chartData.sort((a, b) => a[xAxis] - b[xAxis]);
                } else {
                    chartData = new JsonProcessor().getAggregatedData(chartData, xAxis, yAxis, aggregate);
                }
                self.setState({chartData});
            });
        }
    }

    initializeChart = (values) => {
        //set settings of barchart
        let self = this;
        let processor = values.processor;
        let datasourceUrl = values.datasourceUrl;
        let dataset = values.dataset;
        let data = processor.getDataset(dataset);

        let title = values.title;
        let xAxis = values.xAxis;
        let yAxis = values.yAxis;
        let aggregate = "";

        // if x-axis is non-categorical, 
        // sort data in ascending order by x-axis
        if (processor.getType(dataset, xAxis) !== "string"){
            data.sort((a, b) => a[xAxis] - b[xAxis]);
        } else {
            aggregate = "sum";
            data = processor.getAggregatedData(data, xAxis, yAxis, aggregate);
        }
        
        let summaryData = processor.getDetails(dataset,yAxis);

        this.setState({
            initialized:true,
            datasourceUrl: datasourceUrl,
            dataset: dataset,
            title: title,
            xAxis: xAxis,
            yAxis: yAxis,
            aggregate: aggregate,
            chartData: data,
            summary: values.summary,
            summaryData: summaryData
        })

        console.log(summaryData);
        

        let {chartData, ...other} = this.state;
        this.props.updateProperties(other, this.props.i);
        

    }

    render() {
        return ( 
            <div style={{height:"100%"}}>
            {this.state.initialized ?

            <ResponsiveContainer className="draggable" width="95%" height="90%" >
                <BarChart style={{width:"100%", height:"calc(100% + 20px)"}} data={this.state.chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey={this.state.xAxis}>
                        <Label value={this.state.xAxis} offset={-5} position="insideBottomRight" />
                    </XAxis>
                    <YAxis dataKey={this.state.yAxis}>
                        <Label value={this.state.yAxis} position="outside" angle={-90}/>
                    </YAxis>
                    <Tooltip/>
                    <Bar dataKey={this.state.yAxis} fill="#CD5C5C" />
                    {/* <Bar dataKey="neutral" fill="orange" /> */}
                    {/* <Bar dataKey="negative" fill="grey" /> */}
                    <Legend verticalAlign="bottom"/>
                </BarChart>
            </ResponsiveContainer>
            :   <ChartForm initializeChart={this.initializeChart}/>
            }
            {this.state.summary ? <Descriptive summaryData={this.state.summaryData} ></Descriptive> : ""}
            {/* summary={this.props.properties.summary} summaryData = {this.state.summaryData} */}
            </div>
        );
    }
}

export default Barchart;