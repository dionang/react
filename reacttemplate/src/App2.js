import React, { Component } from 'react';
import Rnd from 'react-rnd';
import ReportComponent from './components/ReportComponent';
import request from 'request';

const barChartData = [
    { name: 'Telstra', positive: 50, neutral: 20, negative: 2 },
    { name: 'Groupstar Public', positive: 40, neutral: 30, negative: 10 },
    { name: 'Orange', positive: 40, neutral: 45, negative: 4 },
    { name: 'Oracle', positive: 30, neutral: 10, negative: 20 }
];

const lineChartData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const api = 'http://localhost:8084/';

class App2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // initial state has two line charts
            components: [
                {type:"image", x:0, y:0, height:200, width:200}
                // {type:"line", x:10, y:10, height:200, width:300, data:lineChartData},
                // {type:"bar", x:320, y:10, height:300, width:400, data:barChartData},
                // {type:"text", x:10, y:310, height:100, width:150, properties:{text:"<p>Hello World!</p>"}},
                // {type:"basic", x:0, y:0, height:300, width:200}
            ]
        }
    }

    addTextbox = () => {
        let components = this.state.components;
        components.push(
            {type:"text", x:0, y:0, height:50, width:200, properties:{text:"<p><br></p>"}}
        );

        this.setState({components});
    }

    addBarChart = () => {
        let components = this.state.components;
        // adds new component to state
        components.push(
            {type:"bar", x:0, y:0, height:200, width:300, data:barChartData}
        );

        // updates state
        this.setState({components});
    }

    addLineChart = () => {
        let components = this.state.components;
        components.push(
            {type:"line", x:0, y:0, height:200, width:300, data:lineChartData}
        );

        this.setState({components});
    }

    addForm = () =>{
        let components = this.state.components;
        components.push(
            {type:"basic", x:0, y:0, height:200, width:200}
        );
        this.setState({components});
    }

    addImage = () =>{
        let components = this.state.components;
        components.push(
            {type:"image", x:0, y:0, height:200, width:200}
        );
        this.setState({components});
    }

    getComponentDetails = () => {
        console.log(this.state.components);
    }

    loadTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("template").value, 10);
        request.post({
            url:  api + 'loadComponents',
            json: true,
            body: {operation:"loadComponents", templateId: templateId}
        }, function(error, response, body){
            let components = body.components;
            for (let component of components){
                if (component.type == "bar") {
                    component.data = barChartData;
                } else if (component.type == "line") {
                    component.data = lineChartData;
                }
            }
            console.log(body);
            self.setState({components});
        });
    }

    saveTemplate = () => {
        let templateId = parseInt(document.getElementById("template").value, 10);
        request.post({
            url:  api + 'saveComponents',
            json: true,
            body: {operation:"saveComponents", templateId: templateId, components:this.state.components}
        }, function(error, response, body){
            console.log(body);
        });
    }

    // i represents index of current item in this.state.components
    // convert style data to integer. e.g. 10px -> 10
    onResizeStop (ref, i){
        let components = this.state.components;
        components[i].height = parseInt(ref.style.height,10);
        components[i].width = parseInt(ref.style.width,10);
        this.setState({components});
        console.log(components);
    }

    onDragStop (ref, i){
        let components = this.state.components;
        components[i].x = ref.x;
        components[i].y = ref.y;
        this.setState({components});
        console.log(components);
    }

    updateProperties = (properties, i) => {
        let components = this.state.components;
        components[i].properties = properties;
        this.setState({properties});
    }

    render() {
        return (
            <div>
                <button onClick={this.addTextbox}>Add Textbox</button>
                <button onClick={this.addBarChart}>Add Bar Chart</button>
                <button onClick={this.addLineChart}>Add Line Chart</button>
                <button onClick={this.getComponentDetails}>Get Component Details</button>
                <button onClick={this.addForm}>Show the form</button>
                <button onClick={this.addImage}>Add Image</button>
                <button onClick={this.saveTemplate}>Save Template</button>
                <button onClick={this.loadTemplate}>Load Template</button>
                <input type="number" id="template" defaultValue="1"/>
                <div id="container">
                    {/* map does a for loop over all the components in the state */}
                    {this.state.components.map((item,i)=>
                        <Rnd key={i} style={{border: "1px solid grey"}}
                            // intialize components x,y,height and width
                            position = {{x: item.x, y: item.y}}
                            size = {{width: item.width, height: item.height}}

                            // min height and size
                            minHeight={80} minWidth={120}

                            // to limit the drag area to a particular class
                            dragHandleClassName={"draggable"}

                            // update height and width onResizeStop
                            // onResizeStop will activate a callback function containing these params
                            // ref represents item that was resized
                            onResizeStop={(event, dir, ref)=>this.onResizeStop(ref,i)}

                            // update height and width onResizeStop
                            // onDragStop will activate a callback function containing these params
                            // ref represents item that was dragged
                            onDragStop={(event, ref)=>this.onDragStop(ref,i)}
                        >
                            <ReportComponent type={item.type} data={item.data} 
                                properties={item.properties} i={i}
                                updateProperties={this.updateProperties.bind(this)}    
                            />
                        </Rnd>
                    )}  
                </div>
            </div>
        ) 
    }
}

export default App2;