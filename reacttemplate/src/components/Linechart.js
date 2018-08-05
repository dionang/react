import React, { Component } from 'react';
import request from 'request';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import BasicForm from './Form';
import JsonProcessor from './JsonProcessor';

class Linechart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData:[]
        }
    }

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
        
        this.setState({
            initialized:true,
            datasourceUrl: datasourceUrl,
            dataset: dataset,
            title: title,
            xAxis: xAxis,
            yAxis: yAxis,
            aggregate: aggregate,
            chartData: data
        })
        
        let {chartData, ...other} = this.state;
        this.props.updateProperties(other, this.props.i);
    }

    render() {
        return this.state.initialized ?
            <ResponsiveContainer className="draggable" width="100%" height="100%">
                <LineChart style={{width:"100%", height:"100%"}} data={this.state.chartData}>
                    <XAxis dataKey={this.state.xAxis}/>
                    <YAxis dataKey={this.state.yAxis}/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend />
                    <Tooltip />
                    <Line type="monotone" dataKey={this.state.yAxis} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
            :   <BasicForm initializeChart={this.initializeChart}/>
    }
}

export default Linechart;