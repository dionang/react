import React, { Component } from 'react';
import BarCharts from './BarCharts';
import LineCharts from './LineCharts';
import './App.css';

class App extends React.Component {
  state = {
    numChildren: 0
  }

  render () {
    const children = [];

    const data1 = [
      { name: 'Telstra', positive: 50, neutral: 20, negative: 2 },
      { name: 'Groupstar Public', positive: 40, neutral: 30, negative: 10 },
      { name: 'Orange', positive: 40, neutral: 45, negative: 4 },
      { name: 'Oracle', positive: 30, neutral: 10, negative: 20 }
    ];

    for (var i = 0; i < this.state.numChildren; i += 1) {
      children.push(<BarCharts key={i} number={i} text={data1}/>);
    };
    

    return (
      <ParentComponent addChild={this.onAddChild}>
        {children}
      </ParentComponent>
    );
  }

  onAddChild = () => {
    this.setState({
      numChildren: this.state.numChildren + 1
    });
  }
}

const ParentComponent = props => (
  <div className="card calculator">
    <button onClick={props.addChild}>Add Bar Chart</button>
    <button onClick={props.addChild}>Add Line Chart</button>
    <div id="children-pane">
      {props.children}
    </div>
  </div>
);

const ChildComponent = props => <div>{"I am child " + props.number}</div>;


export default App;
