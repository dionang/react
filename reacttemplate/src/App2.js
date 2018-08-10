import React, { Component } from 'react';
import Rnd from 'react-rnd';
import request from 'request';
import ReportComponent from './components/ReportComponent';
import { Navbar, Button } from 'react-bootstrap';
import './bootstrap.css';

const api = 'http://localhost:8084/';

class App2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // initial state has two line charts
            components: [
                // {type:"table", x:0, y:0, height:200, width:200}
                // {type:"image", x:0, y:0, height:200, width:200, properties: {imageUrl:''}}
                // {type:"line", x:10, y:10, height:200, width:300, data:lineChartData},
                /*{type:"bar", x:320, y:10, height:300, width:400, display:true,
                    properties:{
                        initialized:true, 
                        datasourceUrl:'http://localhost:8084/Dummy_API/getFurnituresByCategory?category=Furniture', 
                        dataset:'furnitures',
                        title: 'Furniture Sales By Region',  
                        xAxis:'Region', 
                        yAxis:'Sales',
                        aggregate:'sum'
                    }
                },*/
                // {type:"text", x:10, y:310, height:100, width:150, properties:{text:"<p>Hello World!</p>"}},
                // {type:"basic", x:0, y:0, height:300, width:200}
            ],
            editMode: true,
        }
    }

    componentDidMount(){
         this.loadTemplate();
     }

    addTextbox = () => {
        let components = this.state.components;
        components.push(
            {type:"text", x:0, y:0, height:120, width:200, display:true, properties:{text:"<p><br></p>" }}
        );

        this.setState({ components, editMode:true });
    }

    addBarChart = () => {
        let components = this.state.components;
        // adds new component to state
        components.push(
            {
                type:"bar", x:0, y:0, height:200, width:300, display: true,
                properties: {
                    initialized: false,
                    datasourceUrl: '',
                    dataset: '',
                    title: '',
                    xAxis: '',
                    yAxis: ''
                }
            }
        );

        // updates state
        this.setState({ components, editMode:true });
    }

    addLineChart = () => {
        let components = this.state.components;
        components.push(
            {
                type: "line", x: 0, y: 0, height: 200, width: 300, display: true,
                properties: {
                    initialized: false,
                    datasourceUrl: '',
                    dataset: '',
                    title: '',
                    xAxis: '',
                    yAxis: ''
                }
            }
        );

        this.setState({ components, editMode:true });
    }


    addTable = () => {
        let components = this.state.components;
        components.push(
            {type:"table", x:0, y:0, height:200, width:300, display:true}
        );

        this.setState({ components, editMode:true });
    }

    addImage = () => {
        let components = this.state.components;
        components.push(
            {type:"image", x:0, y:0, height:200, width:200, display:true, properties:{imageUrl:''}}
        );
        this.setState({ components });
    }

    changeSettings(i) {
        let components = this.state.components;
        components[i].properties.initialized = false;
        this.setState({ components });
    }

    deleteComponent(i) {
        let components = this.state.components;
        components[i].display = false;
        this.setState({ components });
    }

    getComponentDetails = () => {
        console.log(this.state.components);
    }

    loadTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        request.post({
            url: api + 'loadComponents',
            json: true,
            body: { operation: "loadComponents", templateId: templateId }
        }, function (error, response, body) {
            let components = body.components;
            self.setState({components});
        });
    }

    saveTemplate = () => {
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        request.post({
            url: api + 'saveComponents',
            json: true,
            body: { operation: "saveComponents", templateId: templateId, components: this.state.components }
        }, function (error, response, body) {
            if(body.status) {
                alert("Saved successfully!");
            } else {
                alert("Failed to save!");
            }
        });
    }

    // i represents index of current item in this.state.components
    // convert style data to integer. e.g. 10px -> 10
    onResize(ref, pos, i) {
        let components = this.state.components;
        components[i].height = parseInt(ref.style.height, 10);
        components[i].width = parseInt(ref.style.width, 10);
        components[i].x = pos.x;
        components[i].y = pos.y;
        this.setState({ components });
    }

    onDragStop(ref, i) {
        let components = this.state.components;
        components[i].x = ref.x;
        components[i].y = ref.y;
        this.setState({ components });
    }

    updateProperties = (properties, i) => {
        let components = this.state.components;
        components[i].properties = properties;
        this.setState({properties});
    }


    toggleEditMode = () => {
        this.setState({ editMode: !this.state.editMode })
    }

    render() {
        return (
            <div>
                <div style={{paddingTop:7}}>
                    <Button bsStyle="default" onClick={this.addTextbox}>Add Textbox</Button>
                    <Button bsStyle="default" onClick={this.addBarChart}>Add Bar Chart</Button>
                    <Button bsStyle="default" onClick={this.addLineChart}>Add Line Chart</Button>
                    <Button bsStyle="default" onClick={this.addTable}>Add Table</Button>
                    <Button bsStyle="default" onClick={this.addImage}>Add Image</Button>
                    <Button bsStyle="info" onClick={this.saveTemplate}>Save Template</Button>
                    <Button bsStyle="success" onClick={this.toggleEditMode}>
                        {this.state.editMode ? "Leave Edit Mode" : "Enter Edit Mode"}
                    </Button>
                </div>
                    {/* </Navbar.Collapse> */}
                
                <input type="number" id="templateId" defaultValue="1" />
                <Button bsStyle="info" onClick={this.getComponentDetails} style={{marginTop:10}}>Get Component Details</Button>
                <Button bsStyle="info" onClick={this.loadTemplate} style={{marginTop:10}}>Load Template</Button>

                <div className="container">
                    {/* map does a for loop over all the components in the state */}
                    {this.state.components.map((item, i) => {
                        if (item.display) {
                            return <Rnd key={i} 
                                style={{ 
                                    borderStyle: this.state.editMode ? "dotted" : "hidden", 
                                    borderWidth: 2, 
                                    backgroundColor: "white", 
                                    borderColor: 'grey'
                                }}

                                // intialize components x,y,height and width
                                position={{ x:item.x, y:item.y }}
                                size={{ width:item.width, height:item.height }}

                                // min height and size
                                minHeight={10} minWidth={10}

                                // to limit the drag area to a particular class
                                cancel={".nonDraggable"}
                                dragHandleClassName={"draggable"}

                                // update height and width onResizeStop
                                // onResizeStop will activate a callback function containing these params
                                // ref represents item that was resized
                                onResize={(event, dir, ref, delta, pos) => this.onResize(ref, pos, i)}

                                // update height and width onResizeStop
                                // onDragStop will activate a callback function containing these params
                                // ref represents item that was dragged
                                onDragStop={(event, ref) => this.onDragStop(ref, i)}
                            >
                                <div class = "draggable" style={{float:"none"}}>
                                    <i style={{marginTop:10, marginRight:6,  visibility:this.state.editMode ? "" : "hidden"}} className="fa fa-wrench"
                                        onClick={() => this.changeSettings(i)}></i>
                                    <i style={{marginTop:10, marginRight:10, visibility:this.state.editMode ? "" : "hidden"}} className="fa fa-times"
                                        onClick={() => this.deleteComponent(i)}></i>
                                </div>
                                <ReportComponent type={item.type} editMode={this.state.editMode}
                                    properties={item.properties} i={i}
                                    updateProperties={this.updateProperties.bind(this)}
                                />
                            </Rnd>
                        }
                    })}
                </div>
            </div>
        );
    }
}

export default App2;