import React, { Component } from 'react';
import Rnd from 'react-rnd';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell, ResponsiveContainer, } from 'recharts';
import logo from './logo.svg';
import AutoScale from 'react-auto-scale';


class LineCharts extends Component {
    constructor() {
        super();
        this.state = {
            datasource: "Enter the Chart Name"
        }
    }




    render() {

        

        return (

            <div id="linecharts" >
                <Rnd id="lineChart" style={{ border: "1px solid", color: "grey", height: "fit-content" }} default={{
                    x: 0,
                    y: 0,
                    width: 400,
                    height: 250
                }}>

                    <input type="text" name="dataSource" style={{ align: "center" }} placeholder={this.state.datasource} />
                    <select style={{ align: "center" }}>
                        <option key={"Sales"}>{"Sales"}</option>
                        <option key={"Profits"}>{"Profits"}</option>
                        <option key={"Revenue"}>{"Revenue"}</option>
                        <option key={"Others"}>{"Others"}</option>
                    </select>

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart width={600} height={300} data={this.props.text}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>

                    </ResponsiveContainer>
                </Rnd>

            </div>
        );
    }


}

export default LineCharts;

