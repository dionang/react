import React, { Component } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Textbox from './Textbox';
import BasicForm from './BasicForm';

class ReportComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // based on the item type, render a type of component
        if (this.props.type === "line") {
            return(
                <ResponsiveContainer className="dragHandle" width="100%" height="100%">
                    <LineChart style={{width:"100%", height:"100%"}} data={this.props.data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else if (this.props.type === "bar") {
            return(
                <ResponsiveContainer className="dragHandle" width="100%" height="100%">
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
                    updateProperties={this.props.updateProperties}/>
            );
        } else if (this.props.type === "basic"){
            return(
                <ResponsiveContainer className="dragHandle" width="100%" height="100%">
                    <BasicForm ></BasicForm>
                </ResponsiveContainer>
                
            )
        }
    }
}

export default ReportComponent;

