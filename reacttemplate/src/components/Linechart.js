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
        
        // if x-axis is of a type that can be sorted, 
        // sort data in ascending order by x-axis
        // if (xDetails.type !== "string"){
        //     data.sort((a, b) => a[xAxis] - b[xAxis]);
        //     this.setState({
        //         initialized:true,
        //         xAxis: values.xAxis,
        //         yAxis: values.yAxis,
        //         dataset: dataset,
        //         chartData: data
        //     });

        // // combine values of a same category
        // } else {
        //     let summarizedData = {};
        //     // initialize newData with total value 0
        //     for (let category in xDetails.categories) {
        //         summarizedData[category] = 0;
        //     }

        //     // add value to the appropriate categpry
        //     for (let obj of data){
        //         let category = obj[xAxis];
        //         let value = obj[yAxis];
        //         summarizedData[category] += value;
        //     }

        //     // replace data with new format
        //     data = Object.keys(summarizedData).map((key) => {
        //         return {x: key, y: summarizedData[key]};
        //     });

            this.setState({
                initialized:true,
                datasourceUrl: datasourceUrl,
                dataset: dataset,
                title: title,
                xAxis: xAxis,
                yAxis: yAxis,
                chartData: data
            });
        // }

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