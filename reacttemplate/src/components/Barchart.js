import React, { Component } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import BasicForm from './Form';

class Barchart extends Component {
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
        //set settings of barchart
        let processor = values.processor;
        let data = processor.getDataset(values.dataset);
        console.log(data);
        console.log(values.xAxis);

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
                <BarChart style={{width:"100%", height:"100%"}} data={this.state.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={this.state.xAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={this.state.yAxis} fill="blue" />
                    {/* <Bar dataKey="neutral" fill="orange" /> */}
                    {/* <Bar dataKey="negative" fill="grey" /> */}
                </BarChart>
            </ResponsiveContainer>
            :   <BasicForm initializeChart={this.initializeChart}/>
    }
}

export default Barchart;