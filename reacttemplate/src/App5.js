import React, { Component } from 'react';
import request from 'request';
import PptxGenJS from 'pptxgenjs';
import ReportComponent from './components/ReportComponent';
import './bootstrap.css';
import './report.css';


import apiData from './components/ApiData2';
import JsonProcessor from './components/JsonProcessor';

const api = 'http://localhost:8084/';

class App5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components: [[]],
            editMode: false,
            selectedSize: 'A4',
            selectedLayout: 'Portrait',
            // w : 21*37.795276,
            // h : 29.7*37.795276,
            templateName: "Template Name",
            sidebar: true,
            pageNo: 0,
            halfWidth: window.innerWidth*0.4,
            halfHeight: window.innerHeight*0.7
        }
    }

    componentDidMount() {
        // let templateName = document.getElementById("templateName").value;
        // if (templateName !== "null") {
        //     this.setState({templateName});
        // }
        this.loadTemplate();
    }

    addTextbox = () => {
        let components = this.state.components;
        components[this.state.pageNo].push(
            { type: "text", x: 0, y: 0, height: 150, width: 220, display: true, properties: { text: "<p><br></p>" } }
        );

        this.setState({ components, editMode: true });
    }

    addBarChart = () => {
        let components = this.state.components;
        // adds new component to state
        components[this.state.pageNo].push(
            {
                type: "bar", x: 0, y: 0, height: 250, width: 500, display: true,
                properties: {
                    initialized: false,
                    datasourceUrl: '',
                    dataset: '',
                    title: '',
                    xAxis: '',
                    yAxis: '',
                    summary: '',
                    facetype: true
                }
            }
        );

        // updates state
        this.setState({ components, editMode: true });
    }

    addLineChart = () => {
        let components = this.state.components;
        components[this.state.pageNo].push(
            {
                type: "line", x: 0, y: 0, height: 250, width: 300, display: true,
                properties: {
                    initialized: false,
                    datasourceUrl: '',
                    dataset: '',
                    title: '',
                    xAxis: '',
                    yAxis: '',
                    facetype: true
                }
            }
        );

        this.setState({ components, editMode: true });
    }


    addTable = () => {
        let components = this.state.components;
        components[this.state.pageNo].push(
            { type: "table", x: 0, y: 0, height: 300, width: 300, display: true }
        );

        this.setState({ components, editMode: true });
    }

    addImage = () => {
        let components = this.state.components;
        components[this.state.pageNo].push(
            {
                type: "image", x: 0, y: 0, height: 200, width: 200, display: true,
                properties: {
                    imageUrl: '',
                    initialized: false,
                }
            }
        );
        this.setState({ components, editMode: true });
    }

    addVideo = () => {
        let components = this.state.components;
        components[this.state.pageNo].push(
            {
                type: "video", x: 0, y: 0, height: 200, width: 200, display: true,
                properties: {
                    // using textbox properties for now
                    text: '',
                }
            }
        );
        this.setState({ components, editMode: true });
    }

    changeSettings(i) {
        let components = this.state.components;
        let pageNo = this.state.pageNo;

        components[pageNo][i].properties.initialized = false;
        this.setState({ components });
    }

    closeModal = () => {
        var modal = document.getElementById('size');
        modal.style.display = "none";
    }

    deleteComponent(i) {
        let components = this.state.components;
        let pageNo = this.state.pageNo;

        components[pageNo][i].display = false;
        this.setState({ components });
    }

    getComponentDetails = () => {
        console.log(this.state.components);
    }

    // handleSizeChange = (changeEvent) => {
    //     this.setState({
    //         selectedSize: changeEvent.target.value
    //     });
    // }

    // handleLayoutChange = (changeEvent) => {
    //     this.setState({
    //         selectedLayout: changeEvent.target.value
    //     });
    // }

    loadTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        if (templateId !== 0) {
            request.post({
                url: api + 'loadComponents',
                json: true,
                body: { operation: "loadComponents", templateId: templateId }
            }, function (error, response, body) {
                if (body) {
                    let components = body.components;
                    self.setState({ components });
                }
            });
        }
    }

    previousPage = () => {
        let pageNo = this.state.pageNo;
        if (pageNo !== 0) {
            pageNo = this.state.pageNo - 1;
            this.setState({ pageNo });
        }
    }

    nextPage = () => {
        let components = this.state.components;
        let pageNo = this.state.pageNo + 1;

        // add new page if it doesnt exist
        if (pageNo === components.length) {
            components.push([]);
        }
        this.setState({ components, pageNo });
    }

    renameTemplate = (e) => {
        this.setState({ templateName: e.target.value });
    }

    // i represents index of current item in this.state.components
    // convert style data to integer. e.g. 10px -> 10
    onResize(ref, pos, i) {
        let components = this.state.components;
        let pageNo = this.state.pageNo;
        components[pageNo][i].height = parseInt(ref.style.height, 10);
        components[pageNo][i].width = parseInt(ref.style.width, 10);
        components[pageNo][i].x = pos.x;
        components[pageNo][i].y = pos.y;
        this.setState({ components });
    }

    onDragStop(ref, i) {
        let components = this.state.components;
        let pageNo = this.state.pageNo;
        components[pageNo][i].x = ref.x;
        components[pageNo][i].y = ref.y;
        this.setState({ components });
    }

    saveComponents(templateId) {
        let self = this;
        request.post({
            url: api + 'saveComponents',
            json: true,
            body: { operation: "saveComponents", templateId: templateId, components: self.state.components }
        }, function (error, response, body) {
            if (body && body.status) {
                alert("Saved succesfully");
                // swal("saved succesfully");
            } else {
                alert("Error in saving");
                // swal("error in saving");
            }

        });
    }

    savePresentation = () => {
        var pptx = new PptxGenJS();
        pptx.setBrowser(true);

        for (let pageNo in this.state.components) {
            let components = this.state.components[pageNo];
            let slide = pptx.addNewSlide();
            for (let component of components) {
                // convert px to inches
                let x = component.x / 96;
                let y = component.y / 96;
                let w = component.width / 96;
                let h = (component.height) / 96;

                if (component.type === "text") {
                    // remove the p tags
                    let text = component.properties.text.substring(3, component.properties.text.length - 4);
                    // console.log(text);
                    // let texts = text.split(/\r\n|\n|\r/);
                    // console.log(texts); 
                    slide.addText(text, {
                        x: x, y: y, w: w, h: h,
                        fontSize: 14, color: '363636'
                        // , bullet:{code:'25BA'} 
                    });

                } else if (component.type === "image") {
                    let imageUrl = component.properties.imageUrl;

                    // remove height of toolbar
                    y = (component.y + 27.5) / 96;
                    h = (component.height - 27.5) / 96;
                    slide.addImage({ data: imageUrl, x: x, y: y, w: w, h: h });
                } else if (component.type === "video") {
                    // remove the p tags
                    let videoUrl = component.properties.text.substring(3, component.properties.text.length - 4).trim();
                    console.log(videoUrl);
                    slide.addMedia({ type: 'online', link: videoUrl, x: x, y: y, w: w, h: h });
                }
            }
        }

        pptx.save('Sample Presentation');
    }

    saveTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        let companyId = parseInt(document.getElementById("companyId").value, 10);
        let userName = document.getElementById("userName").value;
        if (templateId === 0 || templateId === 9) {
            request.post({
                url: api + 'createTemplate',
                form: {
                    operation: "createTemplate",
                    templateId: templateId,
                    templateName: self.state.templateName,
                    templatesize: self.state.selectedSize,
                    templatelayout: self.state.selectedLayout,
                    companyId: companyId,
                    userName: userName
                }
            }, function (error, response, body) {
                if (body === "false") {
                    alert("Failed to create template!");
                } else {
                    // update the value of the hidden fields
                    document.getElementById("templateId").value = body;
                    self.saveComponents(body);
                }
            });
        } else {
            request.post({
                url: api + 'updateTemplate',
                form: {
                    operation: "updateTemplate",
                    templateId: templateId,
                    templateName: self.state.templateName,
                    templatesize: self.state.selectedSize,
                    templatelayout: self.state.selectedLayout,
                    companyId: companyId,
                    userName: userName
                }
            }, function (error, response, body) {
                if (body === "false") {
                    alert("Failed to update template!");
                } else {
                    self.saveComponents(templateId);
                }
            });
        }
        this.setState({ editMode: false });
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
        this.setState({ editMode: !this.state.editMode })
    }

    toggleSidebar = () => {
        this.setState({ sidebar: !this.state.sidebar });
    }

    updateProperties = (properties, i) => {
        let components = this.state.components;
        let pageNo = this.state.pageNo;

        components[pageNo][i].properties = properties;
        this.setState({ properties });
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
                <input type="hidden" id="templateId" value="1" />
                <input type="hidden" id="companyId" value="1" />
                <input type="hidden" id="userName" value="manager" />
                <div className={this.state.sidebar ? "nav-md" : "nav-sm"} id="main">
                    <div className="container body" style={{ margin: 0, padding: 0, width: "100%" }}>
                        <div className="main_container">
                            <div className="col-md-3 left_col" style={{ backgroundColor: "#211E1E" }}>
                                <div className="left_col scroll-view" style={{ backgroundColor: "#211E1E" }}>
                                    <div className="navbar nav_title" style={{ border: 0, backgroundColor: "#211E1E" }}>
                                        <a className="site_title">
                                            <img src={"http://www.scube.com.sg/wp-content/uploads/2015/09/SCUBE-BANNER1.png"}
                                                style={{
                                                    height: this.state.sidebar ? 90 : 80,
                                                    width: this.state.sidebar ? 200 : 50,
                                                }} />
                                        </a>
                                    </div>
                                    <div className="clearfix"></div><br />
                                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                                        <div className="menu_section">
                                            <ul className="nav side-menu" id="options">
                                                <li style={{ backgroundColor: "#990000", fontFamily: 'INTUITIVE', fontSize: '16px', 'box-shadow': '0px 10px 20px -8px rgba(204,204,0)' }}><a><i className="fa fa-bar-chart"></i>  DASHBOARD </a></li>
                                                <li><a href="createUserAccount.jsp" style={{ fontFamily: 'INTUITIVE', fontSize: '16px', }}><i className="fa fa-group"></i>  CREATE USER </a></li>
                                                <li><a href="templateHome.jsp" style={{ fontFamily: 'INTUITIVE', fontSize: '16px', }}><i className="fa fa-file-image-o"></i>  TEMPLATE </a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="top_nav" >
                                <div className="nav_menu" style={{ backgroundColor: "#211E1E" }}>
                                    <nav>
                                        <div className="nav toggle" onClick={this.toggleSidebar}>
                                            <a id="menu_toggle"><i className="fa fa-bars" style={{ color: "#FAF5F5" }}></i></a>
                                        </div>
                                        <ul className="nav navbar-nav navbar-right">
                                            <li>
                                                <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <img src="assets/images/user.png" />
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



                            <div className="right_col" width="100%" style={{ backgroundColor: "#F3F3F3", overflow:"hidden" }}>

                                <div className="col-xs-3 col-md-2" style={{ textAlign: "center", 'vertical-align': 'middle', float: "right" }} >
                                    <label style={{ margin: '0px', fontFamily: 'Georgia', fontSize: "16px", marginTop: "5px", height: '100%', width: "30px", backgroundColor: '	brown', width: "100%", color: 'white', borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>Number of Generated Reports</label>
                                    <label style={{ margin: "0px", fontSize: "40px", width: '100%', border: "1px solid grey", }}>100</label>
                                </div>
                                <div className="col-xs-3 col-md-2" style={{ textAlign: "center", verticalAlign: "middle", float: "right" }}>
                                    <label style={{ margin: '0px', fontFamily: 'Georgia', fontSize: "16px", marginTop: "5px", height: '100%', backgroundColor: '	brown', width: "100%", color: 'white', borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>Number of Reports Printed</label>
                                    <br /><label style={{ margin: '0px', fontSize: "40px", width: '100%', border: "1px solid grey", }}>100</label>
                                </div>




                                {/* <button className="btn btn-primary" id="changeSize" onClick={this.openModal} >Change Page Size</button> */}
                                {/* <Button bsStyle="info" onClick={this.getComponentDetails}>Get Component Details</Button> */}
                                {/* <Button className="col-md-2 col-xs-3" style={{ float:"right", minWidth:130 }} bsStyle="info" onClick={this.saveTemplate}>
                                        <i className="fa fa-save" /> Save Template
                                    </Button> */}
                                {/* <Button className="col-md-2 col-xs-3" style={{ float:"right", minWidth:150 }} bsStyle="success" onClick={this.toggleEditMode}>
                                        <i className="fa fa-edit" style={{ marginRight: 2 }} />
                                        {this.state.editMode ? "Leave Edit Mode" : "Enter Edit Mode"}
                                    </Button> */}
                                {/* <Button className="col-md-2 col-xs-2" style={{ float:"right", minWidth:150 }} bsStyle="warning" onClick={this.savePresentation}>
                                        <i className="fa fa-edit" style={{ marginRight: 2 }} /> Export as PPT
                                    </Button> */}
                                <br />

                                <span style={{ fontFamily: "INTUITIVE", fontSize: "20px", marginRight: "20px" }}>Create <span style={{ fontSize: "50px", backgroundColor: "#F3F3F3", fontWeight: 'bold' }}>Dashboard</span> by adding</span>
                                <br />
                                <button data-toggle="tooltip" data-placement="bottom" title="Add Bar Chart"
                                    onClick={this.addBarChart} style={{ marginRight: 5, fontSize: "18px" }}><i className="fa fa-bar-chart" /> Bar Chart</button>
                                <button data-toggle="tooltip" data-placement="bottom" title="Add Line Chart"
                                    onClick={this.addLineChart} style={{ marginRight: 5, fontSize: "18px" }}><i className="fa fa-line-chart" /> Line Chart </button>
                                <button data-toggle="tooltip" data-placement="bottom" title="Add Table"
                                    onClick={this.addTable} style={{ marginRight: 5, fontSize: "18px", }}><i className="fa fa-table" /> Table </button>


                                <div className="col-sm-12 col-xs-12" style={{ borderBottom: '3px solid maroon' }}>

                                    {/* <label> Add Component: </label> */}
                                    {/* <Button data-toggle="tooltip"   data-placement="bottom" title="Add Textbox" bsStyle="primary"
                                        onClick={this.addTextbox}   style={{ marginRight:5, marginLeft: 6 }}><i className="fa fa-font" /></Button> */}

                                    {/* <Button data-toggle="tooltip"   data-placement="bottom" title="Add Image"
                                        onClick={this.addImage}     style={{ backgroundColor:"#31B0D5", color:"white", border:"1px solid #31B0D5", marginRight:5 }}><i className="fa fa-image" /></Button>
                                    <Button data-toggle="tooltip"   data-placement="bottom" title="Add Video"
                                        onClick={this.addVideo}     style={{ backgroundColor:"#D896FF", color:"white", border:"1px solid #D896FF", marginRight:160 }}><i className="fa fa-play-circle" /></Button> */}

                                    {/* <span style={{fontFamily:'Georgia', fontSize:18}}>Page Number</span>
                                    <Button data-toggle="tooltip" data-placement="bottom" title = "Previous Page" bsStyle="warning" bsSize="small" onClick={this.previousPage}
                                        style={{ marginRight: 10, marginLeft: 10}}>
                                        <svg height="15" preserveAspectRatio="xMinYMax meet" viewBox="0 0 17 17" width="24">
                                            <path d="M0-.5h24v24H0z" fill="none"></path>
                                            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" className="jWRuRT"></path>
                                        </svg>
                                    </Button>                                   
                                    <span style={{fontFamily:'Georgia', fontSize:18}}>{this.state.pageNo+1}</span>
                                    <Button data-toggle="tooltip" data-placement="bottom" title = "Next Page" bsStyle="warning" bsSize="small" onClick={this.nextPage}
                                        style={{ marginLeft: 10}}>
                                        <svg height="15" preserveAspectRatio="xMinYMax meet" viewBox="0 0 17 17" width="24">
                                            <path d="M0-.5h24v24H0z" fill="none"></path>
                                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" className="jWRuRT"></path>
                                        </svg>
                                    </Button>

                                    <Button bsStyle="default" bsSize="small" onClick={this.saveTemplate}
                                        style={{ marginLeft: 10, color:'orange', border:'none' }}> <i className="fa fa-save fa-2x" />
                                    </Button> */}
                                </div>

                                {/* this is for the figures on top */}



                                <div id="container" ref={this.myInput} className="col-sm-12 col-xs-12" style={{ backgroundColor: 'white', height: "calc(100% + 100px)", marginTop: 15, display: "block" , overflow:"scroll", marginLeft:"10px", maxHeight:this.state.halfHeight}}>
                                    {/* map does a for loop over all the components in the state */}

                                    

                                    {this.state.components[this.state.pageNo].map((item, i) => {

                                        
                                        if (item.display) {
                                            return <div key={this.state.pageNo + "," + i}

                                                style={{
                                                    borderStyle:"none",
                                                    borderWidth: 0.5,
                                                    backgroundColor: "white",
                                                    borderColor: 'grey',
                                                    width: this.state.halfWidth,
                                                    // height: this.state.halfHeight,
                                                    display: "inline-block",
                                                    marginLeft:"10px"
                                                }}

                                                // intialize components x,y,height and width
                                                position={{ x: item.x, y: item.y }}
                                                size={{ width: item.width, height: item.height }}

                                                // min height and size
                                                minHeight={10} minWidth={10}

                                                // to customize the dragging and resizing behavior
                                                cancel={".nonDraggable"}
                                                dragHandleClassName={this.state.editMode ? "draggable" : "cannotDrag"}

                                                // update height and width onResizeStop
                                                // onResizeStop will activate a callback function containing these params
                                                // ref represents item that was resized
                                                onResize={(event, dir, ref, delta, pos) => this.onResize(ref, pos, i)}

                                                // update height and width onResizeStop
                                                // onDragStop will activate a callback function containing these params
                                                // ref represents item that was dragged
                                                onDragStop={(event, ref) => this.onDragStop(ref, i)}
                                            >
                                                <div style={{ height: 27.5, float: "right" }}>
                                                    <i style={{ zIndex: 99, marginTop: 10, marginRight: 6, visibility: this.state.editMode ? "" : "hidden" }} className="fa fa-wrench"
                                                        onClick={() => this.changeSettings(i)}></i>
                                                    <i style={{ zIndex: 99, marginTop: 10, marginRight: 10, visibility: this.state.editMode ? "" : "hidden" }} className="fa fa-times"
                                                        onClick={() => this.deleteComponent(i)}></i>
                                                </div>
                                                <ReportComponent type={item.type} editMode={this.state.editMode}
                                                    properties={item.properties} i={i}
                                                    updateProperties={this.updateProperties.bind(this)}

                                                />
                                               
                                                {/* <Descriptive type={item.type} editMode={this.state.editMode}
                                                    properties={item.properties} i={i}
                                                    updateProperties={this.updateProperties.bind(this)}></Descriptive>*/}
                                            </div>
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

export default App5;