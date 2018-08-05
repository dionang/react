import React, { Component } from 'react';
import request from 'request';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text} from 'recharts';
import BasicForm from './Form';

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
        if (url){
            request.get({
                url: url,
            }, function(error, response, body){
                let data = JSON.parse(body);
                let chartData = data[self.props.properties.dataset];
                self.setState({chartData});
            });
        }
    }

    initializeChart = (values) => {
        //set settings of linechart
        let processor = values.processor;
        let datasourceUrl = values.datasourceUrl;
        let dataset = values.dataset;
        let title = values.title;
        let xAxis = values.xAxis;
        let yAxis = values.yAxis;
        let data = processor.getDataset(dataset);

        let xDetails = processor.getDetails(dataset, xAxis);
        let yDetails = processor.getDetails(dataset, xAxis);
        
        // will assume string types are category for now
        let xType = xDetails.type === "number" ? "number" : "category";
        let xMin = xDetails.min;
        let xMax = xDetails.max;
        let yType = xDetails.type === "number" ? "number" : "category";

        // if x-axis is of a type that can be sorted, 
        // sort data in ascending order by x-axis.
        // this will keep the line ordered correctly
        if (xType === "number"){
            data.sort((a, b) => a[xAxis] - b[xAxis]);
        }

        this.setState({
            initialized:true,
            datasourceUrl: datasourceUrl,
            dataset: dataset,
            title: title,
            xAxis: xAxis,
            xType: xType,
            yAxis: yAxis,
            chartData: data
        });

        let {chartData, ...other} = this.state;
        this.props.updateProperties(other, this.props.i);
    }

    render() {
        return this.state.initialized ?
            <ResponsiveContainer className="draggable" width="100%" height="100%">
                <LineChart style={{width:"100%", height:"100%"}} data={this.state.chartData}>
                    <XAxis dataKey={this.state.xAxis} type={this.state.xType} allowDuplicatedCategory={false}/>
                    <YAxis dataKey={this.state.yAxis}/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={this.state.yAxis} stroke="#8884d8" />
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                </LineChart>
            </ResponsiveContainer>
            :   <BasicForm initializeChart={this.initializeChart}/>
    }
}

export default Linechart;