import React, { Component } from 'react';
import Rnd from 'react-rnd';
import request from 'request';
import ReportComponent from './components/ReportComponent';
import { Button } from 'react-bootstrap';
import './bootstrap.css';
import './nav.css';
import $ from 'jquery';

const api = 'http://localhost:8084/';

class App3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components: [],
            editMode: true,
            selectedSize: 'A4',
            selectedLayout:'Portrait',
            // w : 21*37.795276,
            // h : 29.7*37.795276,
            formVisibility: "hidden",
            templateName:"Template Name",
            sidebar: false
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

    closeModal = () => {
        var modal = document.getElementById('size');
        modal.style.display = "none";
    }

    deleteComponent(i) {
        let components = this.state.components;
        components[i].display = false;
        this.setState({ components });
    }

    getComponentDetails = () => {
        console.log(this.state.components);
    }

    handleSizeChange= (changeEvent) => {
        this.setState({
            selectedSize: changeEvent.target.value
        });
    }
    
    handleLayoutChange= (changeEvent) => {
        this.setState({
            selectedLayout: changeEvent.target.value
        });
    }

    loadTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        if (templateId !== 0){
            request.post({
                url: api + 'loadComponents',
                json: true,
                body: { operation: "loadComponents", templateId: templateId }
            }, function (error, response, body) {
                let components = body.components;
                self.setState({components});
            });
        }
    }

    renameTemplate = (e) => {
        this.setState({templateName: e.target.value});
    }

    saveTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        //let companyId = parseInt(document.getElementById("companyId").value, 10);
        //let userName =document.getElementById("userName").value;
        if(templateId===0){
            request.post({
                url: api + 'createTemplate',
                form: { 
                    operation: "createTemplate",
                    templateId: templateId,
                    templateName: self.state.templateName,
                    templatesize: self.state.selectedSize,
                    templatelayout: self.state.selectedLayout,
                    companyId: 1,
                    userName: 'aa'
                }
            }, function (error, response, body) {
                if(body === "false") {
                    alert("Failed to create template!");
                } else {
                    templateId = parseInt(body, 10);
                    request.post({
                        url: api + 'saveComponents',
                        json: true,
                        body: { operation: "saveComponents", templateId: templateId, components: self.state.components }
                    }, function (error, response, body) {
                        console.log(body);
                    });
                }
            });  
        } else {
            request.post({
                url: api + 'saveComponents',
                json: true,
                body: { operation: "saveComponents", templateId: templateId, components: self   .state.components }
            }, function (error, response, body) {
                console.log(body);
            });
        }
    }

    // saveTemplate = () => {
    //     let templateId = parseInt(document.getElementById("templateId").value, 10);
    //     request.post({
    //         url: api + 'saveComponents',
    //         json: true,
    //         body: { operation: "saveComponents", templateId: templateId, components: this.state.components }
    //     }, function (error, response, body) {
    //         if(body.status) {
    //             alert("Saved successfully!");
    //         } else {
    //             alert("Failed to save!");
    //         }
    //     });
    // }

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

    toggleChartMenu = () => {
        let chartMenu = document.getElementById("chartMenu");
        if (chartMenu.style.display === "block") {
            chartMenu.style.display = "none";
        } else {
            chartMenu.style.display = "block";
        }
    }

    toggleEditMode = () => {
        this.setState({editMode: !this.state.editMode})
    }

    toggleSidebar = () => {
        this.setState({sidebar: !this.state.sidebar});
    }

    updateProperties = (properties, i) => {
        let components = this.state.components;
        components[i].properties = properties;
        this.setState({properties});
    }

    // handleFormSubmit= (formSubmitEvent) => {
    //     formSubmitEvent.preventDefault();
    //     var size=this.state.selectedSize;
    //     var layout=this.state.selectedLayout;
    //     if (size==="A3" && layout==="Portrait") {
    //         this.setState({w : 29.7 *37.795276, h : 42*37.795276});
    //     } else if (size==="A3" && layout==="Landscape") {
    //         this.setState({h : 29.7 *37.795276, w : 42*37.795276});
    //     } else if (size==="A4" && layout==="Portrait") {
    //         this.setState({h : 29.7 *37.795276, w : 21*37.795276});
    //     } else if (size==="A4" && layout==="Landscape") {
    //         this.setState({w : 29.7 *37.795276, h : 21*37.795276});
    //     } else if (size==="A5" && layout==="Portrait") {
    //         this.setState({w : 14.8*37.795276, h : 21*37.795276}); 
    //     } else if (size==="A5" && layout==="Landscape") {
    //         this.setState({w : 21*37.795276, h : 14.8*37.795276});
    //     }

    //     this.setState({formVisibility:"hidden"});
    //     var modal = document.getElementById('size');
    //     modal.style.display = "none";
    // }

    // openModal = () => {
    //     var modal = document.getElementById('size');
    //     modal.style.display = "block";
    //     this.setState({formVisibility:""});
    // }

    render() {
        return (
            <div>
                <input type="hidden" id="templateId" value="1"/>
                <div className={this.state.sidebar ? "nav-md" : "nav-sm"} id="main">
                    <div className="container body">
                        <div className="main_container">
                            <div className="col-md-3 left_col">
                                <div className="left_col scroll-view">
                                    <div className="navbar nav_title" style={{ border:0 }}>
                                        <a className="site_title">
                                            <img src={this.state.sidebar ? "assets/images/logo.png" : "assets/images/logo1_1.png"} 
                                                style={{ 
                                                    height: this.state.sidebar ? 90 : 80, 
                                                    width: this.state.sidebar ? 200 : 50,  
                                                }}/>
                                        </a>
                                    </div>
                                    <div className="clearfix"></div><br />
                                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                                        <div className="menu_section">
                                            <ul className="nav side-menu" id="options">
                                                <li id="title">
                                                    <a style={{ 
                                                        fontSize: this.state.sidebar ? 16 : 11,
                                                        fontWeight: 'bold'
                                                    }}>Component</a>
                                                </li>
                                                <li><a id="addTextbox" onClick={this.addTextbox}><i className="fa fa-font"/> Textbox</a></li>
                                                <li><a onClick={this.toggleChartMenu}><i className="fa fa-bar-chart"/> Charts <span className="fa fa-chevron-down"></span></a>
                                                    <ul className="nav child_menu" id="chartMenu">
                                                        <li><a onClick={this.addBarChart}><i className="fa fa-bar-chart a"/>Bar</a></li>
                                                        <li><a onClick={this.addLineChart}><i className="fa fa-pie-chart a"/> Pie</a></li>
                                                        <li><a onClick={this.addLineChart}><i className="fa fa-line-chart a"/>Line</a></li>
                                                    </ul>
                                                </li>
                                                <li><a id="addTable" onClick={this.addTable}><i className="fa fa-table"/> Table</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="top_nav" >
                                <div className="nav_menu">
                                    <nav>
                                        <div className="nav toggle" onClick={this.toggleSidebar}>
                                            <a id="menu_toggle"><i className="fa fa-bars"></i></a>
                                        </div>

                                        <ul className="nav navbar-nav navbar-right">
                                            <li>
                                                <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <img src="/assets/images/user.png" />
                                                    <span className=" fa fa-angle-down"></span>
                                                </a>
                                                <ul className="dropdown-menu dropdown-usermenu pull-right">
                                                    <li><a href="javascript:;"> Profile</a></li>
                                                    <li><a href="logout.jsp"><i className="fa fa-sign-out pull-right"></i> Log Out</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <div className="right_col">
                                <div className="row">
                                    <div className="col-md-6 col-xs-12">
                                        <label style={{fontSize:15}}>Template Name: </label>
                                        <input style={{fontSize:15}} value={this.state.templateName} onChange={this.renameTemplate}/>
                                    </div>
                                    <div className="col-md-6 col-xs-12">
                                        {/* <button className="btn btn-primary" id="changeSize" onClick={this.openModal} >Change Page Size</button> */}
                                        {/* <Button bsStyle="info" onClick={this.getComponentDetails}>Get Component Details</Button> */}
                                        <Button style={{float:"right"}} bsStyle="info" onClick={this.saveTemplate}>
                                            <i className="fa fa-save"/> Save Template
                                        </Button>
                                        <Button style={{float:"right"}} bsStyle="success" onClick={this.toggleEditMode}>
                                            <i className="fa fa-edit" style={{marginRight:2}}/>
                                            {this.state.editMode ? "Leave Edit Mode" : "Enter Edit Mode"}
                                        </Button>
                                    </div>
                                </div>
                            

                                {/* <div id="size" className="modal">
                                    <div className="modal-content">
                                        <form onSubmit={this.handleFormSubmit} id="myform" visibility= {this.state.formVisibility}>
                                            <div className="row">
                                                <span className="close" onClick={this.closeModal}>&times;</span>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-offset-4 col-sm-3 ">
                                                    <div className='title'>Please choose your report page size.</div>
                                                    <div className="radio">
                                                        <label><input type="radio" name="size" value="A3" checked={this.state.selectedSize === 'A3'} onChange={this.handleSizeChange}  />A3</label>
                                                    </div>
                                                    <div className="radio">
                                                        <label><input type="radio" name="size" value="A4" checked={this.state.selectedSize === 'A4'} onChange={this.handleSizeChange} />A4</label>
                                                    </div>
                                                    <div className="radio">
                                                        <label><input type="radio" name="size" value="A5" checked={this.state.selectedSize === 'A5'} onChange={this.handleSizeChange} />A5</label>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-sm-offset-4 col-sm-3 ">
                                                    <div className='title'>Please choose your report layout.</div>
                                                    <div className="radio">
                                                        <label><input type="radio" name="layout" value="Portrait" checked={this.state.selectedLayout === 'Portrait'}  onChange={this.handleLayoutChange}  />Portrait</label>
                                                    </div>
                                                    <div className="radio">
                                                        <label><input type="radio" name="layout" value="Landscape" checked={this.state.selectedLayout === 'Landscape'}  onChange={this.handleLayoutChange} />Landscape</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-offset-7 col-sm-2 ">
                                                    <input type="submit" value="Submit" className="btn btn-info" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div> */}
                                <div id="container" style={{backgroundColor:'white',overflow:'auto'}}>
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
                                                <div style={{float:"right"}}>
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App3;