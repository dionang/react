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
        let data = processor.getDataset(values.dataset);
        let types = processor.getTypes(values.dataset);
        console.log(types);
        this.setState({
            initialized:true,
            xAxis: values.xAxis,
            yAxis: values.yAxis,
            data: data
        })
    }

    render() {
        return this.state.initialized ?
            <ResponsiveContainer className="draggable" width="100%" height="100%">
                <LineChart style={{width:"100%", height:"100%"}} data={this.state.data}>
                    <XAxis dataKey={this.state.xAxis}/>
                    <YAxis />
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