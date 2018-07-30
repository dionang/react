import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import BasicForm from './Form';

class Linechart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
            xAxis:'',
            yAxis:'',
            data:[]
        }
    }

    initializeChart = (values) => {
        //set settings of linechart
        let processor = values.processor;
        let xAxis = values.xAxis;
        let yAxis = values.yAxis;
        let dataset = values.dataset;
        let data = processor.getDataset(dataset);

        let xDetails = processor.getDetails(dataset, xAxis);
        let yDetails = processor.getDetails(dataset, xAxis);
        
        // if x-axis is of a type that can be sorted, 
        // sort data in ascending order by x-axis
        if (xDetails.type !== "string"){
            data.sort((a, b) => a[xAxis] - b[xAxis]);
            this.setState({
                initialized:true,
                xAxis: values.xAxis,
                yAxis: values.yAxis,
                data: data
            });
        // combine values of a same category
        } else {
            let summarizedData = {};
            console.log(data);
            // initialize newData with total value 0
            for (let category in xDetails.categories) {
                summarizedData[category] = 0;
            }

            // add value to the appropriate categpry
            for (let obj of data){
                let category = obj[xAxis];
                let value = obj[yAxis];
                summarizedData[category] += value;
            }

            // replace data with new format
            data = Object.keys(summarizedData).map((key) => {
                return {x: key, y: summarizedData[key]};
            });

            console.log(data);
            this.setState({
                initialized:true,
                xAxis: "x",
                yAxis: "y",
                data: data
            })
        }

        
    }

    render() {
        return this.state.initialized ?
            <ResponsiveContainer className="draggable" width="100%" height="100%">
                <LineChart style={{width:"100%", height:"100%"}} data={this.state.data}>
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