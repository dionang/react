import React, { Component } from 'react';
import request from 'request';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import BasicForm from './Form';

class Barchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData:[],
            xType: '',
            yType: ''
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
        //set settings of barchart
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
        console.log(xDetails);
        let yType = xDetails.type === "number" ? "number" : "category";
        
        // if x-axis is of a type that can be sorted, 
        // sort data in ascending order by x-axis
        // if (xDetails.type !== "string"){
        //     data.sort((a, b) => a[xAxis] - b[xAxis]);
        //     this.setState({
        //         initialized:true,
        //         xAxis: values.xAxis,
        //         yAxis: values.yAxis,
        //         data: data
        //     });
        // // combine values of a same category
        // } else {
        //     let summarizedData = {};
        //     console.log(data);
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
        //         let obj = {};
        //         obj[xAxis] = key;
        //         obj[yAxis] = summarizedData[key];
        //         console.log(obj);
        //         return obj;
        //     });

            // console.log(data);
            this.setState({
                initialized:true,
                datasourceUrl: datasourceUrl,
                dataset: dataset,
                title: title,
                xAxis: xAxis,
                xType: xType,
                xMin: xMin,
                xMax: xMax,
                yAxis: yAxis,
                chartData: data
            })
        // }
        
        let {chartData, ...other} = this.state;
        this.props.updateProperties(other, this.props.i);
    }

    render() {
        console.log(this.state.xMax);
        return this.state.initialized ?
            <ResponsiveContainer className="draggable" width="100%" height="100%">
                <BarChart style={{width:"100%", height:"100%"}} data={this.state.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={this.state.xAxis} type={this.state.xType} domain={["auto", "auto"]} allowDuplicatedCategory={false}/>
                    <YAxis dataKey={this.state.yAxis}  />
                    <Tooltip />
                    <Bar dataKey={this.state.yAxis} fill="blue" />
                    {/* <Bar dataKey="neutral" fill="orange" /> */}
                    {/* <Bar dataKey="negative" fill="grey" /> */}
                    <Legend/>
                </BarChart>
            </ResponsiveContainer>
            :   <BasicForm initializeChart={this.initializeChart}/>
    }
}

export default Barchart;