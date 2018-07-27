import React, { Component } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Textbox from './Textbox';
import BasicForm from './Form';
import Linechart from './Linechart.jsx';

class ReportComponent extends Component {
    render() {
        // based on the item type, render a type of component
        if (this.props.type === "line") {
            return(
                <Linechart data={this.props.data}/>
            );
        } else if (this.props.type === "bar") {
            return (
                <ResponsiveContainer className="draggable" width="100%" height="100%">
                    <BarChart style={{width:"100%", height:"100%"}} data={this.props.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="positive" fill="blue" />
                        <Bar dataKey="neutral" fill="orange" />
                        <Bar dataKey="negative" fill="grey" />
                    </BarChart>
                </ResponsiveContainer>
            );
        } else if (this.props.type === "text") {
            return(
                <Textbox i={this.props.i} text={this.props.properties.text} 
                    updateProperties={this.props.updateProperties} />
            );
        } else if (this.props.type === "basic"){
            return(
                <BasicForm/>
            )
        }
    }
}

export default ReportComponent;

