import React, { Component } from 'react';
import BarCharts from './BarCharts';
import LineCharts from './LineCharts';
import './App.css';

class App extends Component {
  constructor () {
    super()
    this.state = {
      isHidden: true
    }
  }
  
  showBarChart () {
    BarCharts.setState({
      isHidden: false
    })
  }

  showLineChart () {
    LineCharts.setState({
      isHidden: false
    })
  }

  


  render () {

    const data1 = [
      { name: 'Telstra', positive: 50, neutral: 20, negative: 2 },
      { name: 'Groupstar Public', positive: 40, neutral: 30, negative: 10 },
      { name: 'Orange', positive: 40, neutral: 45, negative: 4 },
      { name: 'Oracle', positive: 30, neutral: 10, negative: 20 }
  ];

  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

  const BarChart = () => (
    <div className='barChart'>
          <BarCharts text = {data1} />
      </div>
    )

    const LineChart = () => (
      <div className='lineChart'>
            <LineCharts text = {data} />
        </div>
      )


    return (
      <div>
        <button onClick={this.showBarChart.bind(this)} >
          Add Bar Charts
        </button>
        {!this.state.isHiddenA && <BarChart />}

        <button onClick={this.showLineChart.bind(this)} >
          Add Line Charts
        </button>
        {!this.state.isHiddenB && <LineChart />}

      </div>
    ) 
  }
}





export default App;