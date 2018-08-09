import React, { Component } from 'react';
import Rnd from 'react-rnd';
import request from 'request';
import ReportComponent from './components/ReportComponent';
import { FormGroup, FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Row, Col, Grid, Button } from 'react-bootstrap';
import './bootstrap.css';
import './nav.css';
import $ from 'jquery';

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
            border: "dotted",
            visibility: "",
            editButtonValue: "Leave Edit Mode",
            selectedSize: 'A4',
            selectedLayout:'Portrait',
            w : 21*37.795276,
            h : 29.7*37.795276,
            formVisibility: "hidden"

        }

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

      handleFormSubmit= (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
        var size=this.state.selectedSize;
        var layout=this.state.selectedLayout;
        var h;
        var w;
        if (size==="A3" && layout==="Portrait") {
            this.setState({w : 29.7 *37.795276,
                h : 42*37.795276});
            
        }
        else if (size==="A3" && layout==="Landscape") {
            this.setState({h : 29.7 *37.795276,
                w : 42*37.795276});

        }
        else if (size==="A4" && layout==="Portrait") {
            this.setState({h : 29.7 *37.795276,
                w : 21*37.795276});

        }
        else if (size==="A4" && layout==="Landscape") {
            this.setState({w : 29.7 *37.795276,
                h : 21*37.795276});

        }
        else if (size==="A5" && layout==="Portrait") {
            
            this.setState({w : 14.8*37.795276,
                h : 21*37.795276}); 

        } else if (size==="A5" && layout==="Landscape") {
            this.setState({w : 21*37.795276,
                h : 14.8*37.795276});
        }

        this.setState({formVisibility:"hidden"});
       
        var modal = document.getElementById('size');
        modal.style.display = "none";
      }

    addTextbox = () => {
        let components = this.state.components;
        components.push(
            { type: "text", x: 0, y: 0, height: 50, width: 200, display: true, properties: { text: "<p><br></p>" } }
        );

        this.setState({ components });
    }

    addBarChart = () => {
        let components = this.state.components;
        // adds new component to state
        components.push(
            {
                type: "bar", x: 0, y: 0, height: 200, width: 300, display: true,
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
        this.setState({ components });
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

        this.setState({ components });
    }


    addTable = () => {
        let components = this.state.components;
        components.push(
            { type: "table", x: 0, y: 0, height: 200, width: 300, display: true }
        );

        this.setState({ components });
    }

    addImage = () => {
        let components = this.state.components;
        components.push(
            { type: "image", x: 0, y: 0, height: 200, width: 200, display: true, properties: { imageUrl: '' } }
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
        let templateId = parseInt(document.getElementById("template").value, 10);
        request.post({
            url: api + 'loadComponents',
            json: true,
            body: { operation: "loadComponents", templateId: templateId }
        }, function (error, response, body) {
            let components = body.components;
            // for (let component of components){
            //     if (component.type === "bar") {
            //         component.data = barChartData;
            //     } else if (component.type === "line") {
            //         component.data = lineChartData;
            //     }
            // }
            // console.log(body);
            self.setState({ components });
        });
    }

    saveTemplate = () => {
        let templateId = parseInt(document.getElementById("template").value, 10);
        request.post({
            url: api + 'saveComponents',
            json: true,
            body: { operation: "saveComponents", templateId: templateId, components: this.state.components }
        }, function (error, response, body) {
            console.log(body);
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
        this.setState({ properties });
    }



    leaveEditMode = () => {
        if (this.state.border === "dotted") {
            this.setState({ border: "hidden", visibility: "hidden", editButtonValue: "Edit the View" })
        } else {
            this.setState({ border: "dotted", visibility: "", editButtonValue: "Leave Edit Mode" })
        }

    }
    componentDidMount() {


        // Toggle sidebar
        $('#options li').click(function () {
            $(this).find('ul').toggle();
        });

        $('#menu_toggle').click(function () {
            $('#logo').toggle();
            $('#logo2').toggle();
            $('#title').toggle();
            $('#title1').toggle();
            if ($('div').hasClass('nav-md')) {
                //$('#sidebar-menu').find('li.active ul').hide();
                $('#sidebar-menu').find('li.active').addClass('active-sm').removeClass('active');
            } else {
                // $('#sidebar-menu').find('li.active-sm ul').show();
                $('#sidebar-menu').find('li.active-sm').addClass('active').removeClass('active-sm');
            }

            $('#main').toggleClass('nav-md nav-sm');
        });

    }

    openModal = () => {
        var modal = document.getElementById('size');
        modal.style.display = "block";
        this.setState({formVisibility:""});
    }

    closeModal = () => {
        var modal = document.getElementById('size');
        modal.style.display = "none";
    }


    render() {
        return (
            <div>
                <div className="nav-md" id="main">
                    <div className="container body">
                        <div className="main_container">
                            <div className="col-md-3 left_col">
                                <div className="left_col scroll-view">
                                    <div className="navbar nav_title" id="logo" style={{ border: 0 }}>
                                        <a href="" className="site_title"><img src="/assets/images/logo.png" style={{ height: 90, width: 200 }} /></a>
                                    </div>
                                    <div className="navbar nav_title" id="logo2" style={{ border: 0, display: 'none' }}>
                                        <a href="" className="site_title"><img src="/assets/images/logo1_1.png" style={{ height: 80, width: 50 }} /></a>
                                    </div>
                                    <div className="clearfix"></div><br />
                                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                                        <div className="menu_section">
                                            <ul className="nav side-menu" id="options">
                                                <li id="title"><a style={{ fontSize: 16, fontWeight: 'bold' }}>Component</a></li>
                                                <li id="title1" style={{ display: 'none' }}><a style={{ fontWeight: 'bold', fontSize: 11 }}> Component</a></li>
                                                <li><a id="addTextbox" onClick={this.addTextbox}><i className="fa fa-font"></i> Textbox</a></li>
                                                <li><a><i className="fa fa-bar-chart"></i> Charts <span className="fa fa-chevron-down"></span></a>
                                                    <ul className="nav child_menu">
                                                        <li><a id="addBarChart" onClick={this.addBarChart}><i className="fa fa-bar-chart a"  ></i>Bar</a></li>
                                                        <li><a id="addPieChart" onClick={this.addLineChart}><i className="fa fa-pie-chart a"></i> Pie</a></li>
                                                        <li><a id="addLineChart" onClick={this.addLineChart}><i className="fa fa-line-chart a"></i>Line</a></li>
                                                    </ul>
                                                </li>
                                                <li><a id="addTable" onClick={this.addTable}><i className="fa fa-table"></i> Table</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="top_nav" >
                                <div className="nav_menu">
                                    <nav>
                                        <div className="nav toggle">
                                            <a id="menu_toggle"><i className="fa fa-bars"></i></a>
                                        </div>

                                        <ul className="nav navbar-nav navbar-right">
                                            <li>
                                                <a href="javascript:;" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
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
                                <button className="btn btn-primary" id="changeSize" onClick={this.openModal} >Change Page Size</button>
                                <button className="btn btn-success" id="createTemplate" onClick={this.saveTemplate}>Create Template</button>
                                <button className="btn" id="printPage" >Screenshot</button>
                                <br /><br />
                                <div className="row">
                                    <div className="col-md-2">
                                        <h4>Template Name: </h4>
                                    </div>
                                    <div className="col-md-5">
                                        <input type="text" name="templateName" className="tbTemplate" />
                                    </div>
                                </div>

                                <div id="size" className="modal">

                                    /* Modal content */
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
                                                        <label><input type="radio" name="size" value="A4" checked={this.state.selectedSize === 'A4'} onChange={this.handleSizetChange} />A4</label>
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
                                </div>







                                <Button bsStyle="info" onClick={this.saveTemplate} style={{ marginTop: 10 }}>Save Template</Button>
                                <Button bsStyle="info" onClick={this.getComponentDetails} style={{ marginTop: 10 }}>Get Component Details</Button>
                                <Button bsStyle="info" onClick={this.loadTemplate} style={{ marginTop: 10 }}>Load Template</Button>
                                <Button bsStyle="success" onClick={this.leaveEditMode} style={{ marginTop: 10 }}>{this.state.editButtonValue}</Button>

                                <input type="number" id="template" defaultValue="1" />
                                <div style={{maxWidth:70 , maxHeight:100}}>
                                <div id="container" style={{width:this.state.w, height:this.state.h, backgroundColor:'white',overflow:'auto'}}>
                                    {/* map does a for loop over all the components in the state */}
                                    {this.state.components.map((item, i) => {
                                        if (item.display) {
                                            return <Rnd key={i} style={{ padding: 10, "borderStyle": this.state.border, "borderWidth": 2 }}

                                                // intialize components x,y,height and width
                                                position={{ x: item.x, y: item.y }}
                                                size={{ width: item.width, height: item.height }}

                                                // min height and size
                                                minHeight={80} minWidth={120}

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
                                                <div style={{ float: "right" }}>
                                                    <i style={{ "marginTop": 10, "marginRight": 6, visibility: this.state.visibility }} className="fa fa-wrench"
                                                        onClick={() => this.changeSettings(i)}></i>
                                                    <i style={{ "marginTop": 10, "marginRight": 10, visibility: this.state.visibility }} className="fa fa-times"
                                                        onClick={() => this.deleteComponent(i)}></i>
                                                </div>
                                                <ReportComponent type={item.type}
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




            </div>
        )
    }
}

export default App2;