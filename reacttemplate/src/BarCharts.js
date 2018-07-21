import React, { Component } from 'react';
import Rnd from 'react-rnd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import logo from './logo.svg';
import AutoScale from 'react-auto-scale';


class BarCharts extends Component {
    constructor() {
        super();
        this.state = {
            datasource: "Enter the Chart Name"
        }
    }



    render() {
        return (

            <div id="barcharts" >
                <Rnd id="barChart" style={{ border: "1px solid", color: "grey", height: "fit-content" }} default={{
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

                        <BarChart width={800} height={250} data={this.props.text}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                </Rnd>

            </div>
        );
    }


}

export default BarCharts;

