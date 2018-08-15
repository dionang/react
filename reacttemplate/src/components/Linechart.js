import React, { Component } from 'react';
import request from 'request';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Legend, Tooltip, ResponsiveContainer} from 'recharts';
import ChartForm from './ChartForm';
import JsonProcessor from './JsonProcessor';

class Linechart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData:[]
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
        
            <ResponsiveContainer className="draggable" width="95%" height="90%">
                    <LineChart style={{width:"100%", height:"calc(100% + 20px)"}} data={this.state.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={this.state.xAxis}>
                            <Label value={this.state.xAxis} offset={-5} position="insideBottomRight" />
                        </XAxis>
                        <YAxis dataKey={this.state.yAxis}>
                            <Label value={this.state.yAxis} position="outside" angle={-90}/>
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={this.state.yAxis} stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
           
            :   <ChartForm initializeChart={this.initializeChart}/>
    }
}

export default Linechart;