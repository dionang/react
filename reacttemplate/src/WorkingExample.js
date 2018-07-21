import React, { Component } from 'react';
import Rnd from 'react-rnd';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell,ResponsiveContainer} from 'recharts';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {clicked:0}
  }
  
  clickBartChart(){
    var clicks = this.state.clicked;
    this.setState({
      clicked: clicks+1
    });
  }

  render() {

    const data1 = [
      { name: 'Telstra', positive: 50, neutral: 20, negative: 2 },
      { name: 'Groupstar Public', positive: 40, neutral: 30, negative: 10 },
      { name: 'Orange', positive: 40, neutral: 45, negative: 4 },
      { name: 'Oracle', positive: 30, neutral: 10, negative: 20 }
    ];



    return (
      <div id="barcharts">
        <button onClick={() => this.clickBartChart()} >
          {this.state.clicked} bar charts has been created.
        </button>

        <Rnd id="barChart" style={{ border: "1px solid" }} default={{
          x: 0,
          y: 0,
          width: 400,
          height: 250
        }}>
          <ResponsiveContainer width={"100%"} height="100%">

            <BarChart width={800} height={250} data={data1}
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


