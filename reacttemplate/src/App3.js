import React, { Component } from 'react';
import Rnd from 'react-rnd';
import request from 'request';
import PptxGenJS from 'pptxgenjs';
import domtoimage from "dom-to-image-chrome-fix";
import { ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap';
import ReportComponent from './components/ReportComponent';
import './bootstrap.css';
import './report.css';
import jsPDF from 'jspdf';

const api = 'http://localhost:8084/';

class App3 extends Component {
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
            picArr: [],
            exporting: false
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
                type: "bar", x: 0, y: 0, height: 370, width: 450, display: true,
                properties: {
                    initialized: false,
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
                type: "line", x: 0, y: 0, height: 370, width: 450, display: true,
                properties: {
                    initialized: false,
                }
            }
        );

        this.setState({ components, editMode: true });
    }

    addTable = () => {
        let components = this.state.components;
        components[this.state.pageNo].push(
            { 
                type: "table", x: 0, y: 0, height:140, width:300, display: true,
                properties: {
                    columns: [{
                        dataField: 'col1',
                        text: 'Header 1'
                    }, {
                        dataField: 'col2',
                        text: 'Header 2'
                    }],
                    data: [{
                        id: 'row1',
                        col1: '',
                        col2: '',
                    },{
                        id: 'row2',
                        col1: '',
                        col2: ''
                    }]
                }
            }
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
                type: "video", x: 0, y: 0, height: 240, width: 400, display: true,
                properties: {
                    initialized: false,
                    videoUrl: '',
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

    dataUrlToFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    deleteComponent(i) {
        let components = this.state.components;
        let pageNo = this.state.pageNo;

        components[pageNo][i].display = false;
        this.setState({ components });
    }

    export = (e) => {
        let self = this;
        this.setState({editMode: false});
        setTimeout(function () {
            if (e === "PDF") {
                self.savePDF();
            } else {
                self.savePresentation();
            }
        }, 100);
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
                // swal({icon:"success", text:"Saved succesfully"});
            } else {
                alert("Error in saving");
                // swal({icon:"error", text:"Error in saving"});
            }

        });
    }

    savePDF() {
        let self = this;

        // if exporting
        if (this.state.exporting) {
            domtoimage.toJpeg(document.getElementById('container'), { quality: 1 })
                .then(function (dataUrl) {
                    // add page screenshot to picArr
                    var picArr = self.state.picArr;
                    picArr.push(dataUrl);
                    let pageNo = self.state.pageNo;

                    // if not on last page, increment pageNo and trigger rerender
                    if (pageNo < self.state.components.length - 1) {
                        pageNo += 1;
                        self.setState({ pageNo });

                        // give time for page to rerender before calling the method
                        setTimeout(function () {
                            self.savePDF();
                        }, 2000);

                        // reached the last page, proceed to export PDF
                    } else {
                        // hardcoded A4 dimensions, width * height
                        let doc = new jsPDF('l', 'mm', [297, 210]);

                        // iterate through the pages
                        for (let i = 0; i < self.state.picArr.length; i++) {
                            let dataUrl = self.state.picArr[i];

                            // uploads the image to our public folder
                            let formData = new FormData();
                            formData.append("file", self.dataUrlToFile(dataUrl, self.state.templateName + "_slide" + (i + 1) + ".jpg"));
                            let xhr = new XMLHttpRequest();
                            xhr.open("POST", api + "saveFile");
                            xhr.send(formData);

                            // should use these values to set PDF dimensions
                            // let width = document.getElementById('container').width;
                            // let height = document.getElementById('container').height;

                            doc.addImage(dataUrl, 'JPEG', 0, 0, 297, 140);

                            // 20 is left margin, 200 is top margin
                            doc.text(20, 200, "Page No: " + (i + 1));

                            // if not last page, add page
                            if (i != self.state.picArr.length - 1) {
                                doc.addPage();
                            }
                        }

                        // completed the rendering of doc
                        // upload PDF to public folder
                        let formData = new FormData();
                        formData.append("file", doc.output('blob'), self.state.templateName + ".pdf");
                        let xhr = new XMLHttpRequest();
                        xhr.open("POST", api + "saveFile");
                        xhr.send(formData);

                        // proceed to save locally
                        doc.save(self.state.templateName);
                        picArr = [];
                        self.setState({ picArr: [], exporting: false });
                    }
                });

            // starts the exporting process, starting from the first page
        } else {
            this.setState({ pageNo: 0, exporting: true });

            // give time for page to rerender before calling the method
            setTimeout(function () {
                self.savePDF();
            }, 1500);
        }
    }

    savePresentation = () => {
        var pptx = new PptxGenJS();
        pptx.setBrowser(true);

        for (let pageNo in this.state.components) {
            let components = this.state.components[pageNo];
            let slide = pptx.addNewSlide();
            for (let component of components) {
                // if component is not displayed, skip the entry
                if (!component.display) {
                    continue;
                }

                // convert px to inches
                let x = component.x / 96;
                let y = component.y / 96;
                let w = component.width / 96;
                let h = (component.height) / 96;

                if (component.type === "text") {
                    let text = component.properties.text;
                    // remove non breaking spaces
                    text = text.replace(/&nbsp;/g, " ");
                    // replace break tag
                    text = text.replace(new RegExp("<br>","g"), "\n");
                    // extract all tokens
                    let tokens = text.split(/(<strong>|<\/strong>|<em>|<\/em>|<u>|<\/u>|<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>)/);

                    let texts = [];
                    let bold = false;
                    let underline = false;
                    let italic = false;
                    let breakLine = true;
                    let bulletType = false;
                    let bullet = false;
                    for (let text of tokens){
                        if (text === "" || text === "\n" || text === "\n  ") {
                            continue;
                        } else if (text === "<strong>" || text === "</strong>"){
                            bold = !bold;
                        } else if (text === "<em>" || text === "</em>"){
                            italic = !italic;
                        } else if (text === "<u>" || text === "</u>"){
                            underline = !underline;
                        } else if (text === "<p>" || text === "</p>") {
                            breakLine = !breakLine;
                            // push a line break if p tag end was hit
                            if (breakLine) {
                                texts.push({text:"\n"});
                            }
                        } else if (text === "<ul>" || text === "</ul>") {
                            bulletType = true;
                        } else if (text === "<ol>" || text === "</ol>") {
                            bulletType = {type:"number"};
                        } else if (text === "<li>" || text === "</li>") {
                            bullet = !bullet;
                        } else {
                            let textItem = { text:text, options:{ bold:bold, underline:underline, italic:italic }};
                            // only introduce the bullet attribute if necessary, as this starts a new line
                            if (bullet) {
                                textItem.options.bullet = bulletType;
                            }
                            texts.push(textItem);
                        }
                    }

                    slide.addText(texts, {
                        x: x, y: y, w: w, h: h,
                        fontSize: 14, color: '363636'
                    });
                } else if (component.type === "image") {
                    let imageUrl = component.properties.imageUrl;

                    // remove height of toolbar
                    y = (component.y + 27.5) / 96;
                    h = (component.height - 27.5) / 96;
                    slide.addImage({ data: imageUrl, x: x, y: y, w: w, h: h });
                } else if (component.type === "table") {
                    // remove height of toolbar
                    y = (component.y + 27.5) / 96;
                    h = (component.height - 27.5) / 96;
                    let headerNames = [];
                    let headerData = [];

                    // store the header names and data
                    for (let col of component.properties.columns) {
                        headerNames.push(col.dataField);
                        headerData.push({text: col.text, options: {bold: true}});
                    }

                    let tableData = [];
                    tableData.push(headerData);

                    // insert table data
                    for (let row of component.properties.data) {
                        let rowData = [];
                        for (let name of headerNames) {
                            rowData.push(row[name]);
                        }

                        tableData.push(rowData);
                    }

                    let tableOpts = { x:x, y:y, w:w }
                    slide.addTable(tableData, tableOpts);
                } else if (component.type === "video") {
                    // remove the p tags
                    let videoUrl = component.properties.videoUrl.trim();
                    slide.addMedia({ type: 'online', link: videoUrl, x: x, y: y, w: w, h: h });
                }
            }
        }

        pptx.save(this.state.templateName);
    }

    saveTemplate = () => {
        let self = this;
        let templateId = parseInt(document.getElementById("templateId").value, 10);
        let companyId = parseInt(document.getElementById("companyId").value, 10);
        let userName = document.getElementById("userName").value;
        if (templateId === 0 || templateId === 1) {
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
                    alert("Failed to create template!")
                    // swal({icon:"error", text:"Failed to create template!"});
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
                    alert("Failed to update template!")
                    // swal({icon:"error", text:"Failed to update template!"});
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
                <input type="hidden" id="templateId" value="4" />
                <input type="hidden" id="companyId" value="1" />
                <input type="hidden" id="userName" value="manager" />
                <input type="hidden" id="profileName" value="Manager" />
                <div className={this.state.sidebar ? "nav-md" : "nav-sm"} id="main">
                    <div className="container body" style={{ margin: 0, padding: 0, width: "100%" }}>
                        <div className="main_container">
                            <div className="col-md-3 left_col">
                                <div className="left_col scroll-view">
                                    <div className="navbar nav_title" style={{ border: 0 }}>
                                        <a className="site_title">
                                            <img src={this.state.sidebar ? "assets/images/logo.png" : "assets/images/logo1_1.png"}
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
                                                <li><a href="managerHome.jsp"><i className="fa fa-home"/>  Home</a></li>
                                                <li><a href="dashboard.jsp"><i className="fa fa-bar-chart"></i>  View Dashboard</a></li>
                                                <li><a href="createUserAccount.jsp"><i className="fa fa-group"></i>  Create User Account</a></li>
                                                <li><a href="templateHome.jsp"><i className="fa fa-file-image-o"></i>  Template</a></li>
                                                <li><a href="slideShow.jsp"><i className="fa fa-slideshare"></i>  Slide Show</a></li>
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
                                                    {/* {document.getElementById('profileName').value} */}
                                                    <img style={{ marginLeft: 2 }} src="assets/images/user.png" />
                                                    <span className=" fa fa-angle-down"></span>
                                                </a>
                                                <ul className="dropdown-menu dropdown-usermenu pull-right">
                                                    <li><a href="logout.jsp"><i className="fa fa-sign-out pull-right"></i> Log Out</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>

                            <div className="right_col">
                                <div className="col-md-12 col-xs-12">
                                    <label style={{ fontSize: 15, marginRight: 2, float:"left" }}>Template Name:</label>
                                    <input style={{ fontSize: 15, float:"left" }} value={this.state.templateName} onChange={this.renameTemplate} />
                                    <span style={{float:"right"}}>
                                        <DropdownButton title="Export As" id="dropdown-size-medium"  onSelect={this.export}>
                                            <MenuItem eventKey="PDF">PDF</MenuItem>
                                            <MenuItem eventKey="PPT">PPT</MenuItem>
                                        </DropdownButton>
                                    </span>
                                    <Button bsStyle="info" onClick={this.getComponentDetails}>Get Component Details</Button>
                                </div>
                                
                                {/* <button className="btn btn-primary" id="changeSize" onClick={this.openModal} >Change Page Size</button> */}

                                {/* <Button className="col-md-2 col-xs-2" style={{ float: "right", width: "fit-content" }} bsStyle="warning" onClick={this.savePresentation}>
                                    <i className="fa fa-edit" style={{ marginRight: 2 }} /> Export as PPT
                                </Button>
                                <Button className="col-md-2 col-xs-2" style={{ float: "right", width: "fit-content" }} bsStyle="info" onClick={() => { this.setState({ editMode: false }); this.savePDF() }}>
                                    <i className="fa fa-save" /> Save PDF
                                </Button> */}

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

                                <div className="col-sm-12 col-xs-12" style={{ paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', borderBottom: '7px solid #EB6B2A' }}>
                                    <label> Add Component: </label>
                                        
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Add Textbox" bsStyle="primary"
                                        onClick={this.addTextbox} style={{ marginRight: 5, marginLeft: 6 }}><i className="fa fa-font" /></Button>
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Add Bar Chart" bsStyle="warning"
                                        onClick={this.addBarChart} style={{ marginRight: 5 }}><i className="fa fa-bar-chart" /></Button>
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Add Line Chart" bsStyle="success"
                                        onClick={this.addLineChart} style={{ marginRight: 5 }}><i className="fa fa-line-chart" /></Button>
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Add Table" bsStyle="danger"
                                        onClick={this.addTable} style={{ marginRight: 5 }}><i className="fa fa-table" /> </Button>
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Add Image"
                                        onClick={this.addImage} style={{ backgroundColor: "#31B0D5", color: "white", border: "1px solid #31B0D5", marginRight: 5 }}><i className="fa fa-image" /></Button>
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Add Video"
                                        onClick={this.addVideo} style={{ backgroundColor: "#D896FF", color: "white", border: "1px solid #D896FF", marginRight: 5}}><i className="fa fa-play-circle" /></Button>

                                    <span style={{ fontFamily: 'Georgia', fontSize: 18,  margin: "60px" }}>Page Number
                                    <Button data-toggle="tooltip" data-placement="bottom" title="Previous Page" bsStyle="warning" bsSize="small" onClick={this.previousPage}
                                        style={{ marginRight: 10, marginLeft: 10, textAlign:"center"  }}>
                                        <svg height="15" preserveAspectRatio="xMinYMax meet" viewBox="0 0 17 17" width="24">
                                            <path d="M0-.5h24v24H0z" fill="none"></path>
                                            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" className="jWRuRT"></path>
                                        </svg>
                                    </Button>

                                    <span style={{ fontFamily: 'Georgia', fontSize: 18,textAlign:"center"  }}>{this.state.pageNo + 1}</span>
                                        <Button data-toggle="tooltip" data-placement="bottom" title="Next Page" bsStyle="warning" bsSize="small" onClick={this.nextPage}
                                            style={{ marginLeft: 10,  textAlign:"center"  }}>
                                            <svg height="15" preserveAspectRatio="xMinYMax meet" viewBox="0 0 17 17" width="24">
                                                <path d="M0-.5h24v24H0z" fill="none"></path>
                                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" className="jWRuRT"></path>
                                            </svg>
                                        </Button>
                                        <Button style={{ marginLeft: 5,marginRight:5}} bsStyle = "info" onClick={this.saveTemplate}> 
                                            <i className="fa fa-save fa-lg" style={{marginRight:4}}/>Save
                                        </Button>
                                        {this.state.editMode ?
                                            <span>
                                                <Button className="col-md-2 col-xs-2" style={{ width: "fit-content", marginLeft:5, float:'right' }} bsStyle="danger" onClick={this.toggleEditMode}>
                                                    <i className="fa fa-edit" style={{ marginRight: 2 }} />
                                                    Editing
                                                </Button>
                                            </span>
                                            :
                                            <span>
                                                <Button className="col-md-2 col-xs-2" style={{ width: "fit-content", marginLeft:5, float:'right'}} bsStyle="success" onClick={this.toggleEditMode}>
                                                    <i className="fa fa-edit" style={{ marginRight: 2 }} />
                                                    Edit
                                                </Button>
                                            </span>
                                        }                            
                                    </span>
                                </div>

                                <div className="col-sm-12 col-xs-12" style={{ background: "#EEEEEE" }}>
                                    <div id="container" style={{
                                        backgroundColor: 'white', height: window.innerHeight * 0.70, margin: 0
                                    }}>

                                        {/* map does a for loop over all the components in the state */}
                                        {this.state.components[this.state.pageNo].map((item, i) => {
                                            if (item.display) {
                                                return <Rnd key={this.state.pageNo + "," + i}
                                                    style={{
                                                        borderStyle: this.state.editMode ? "dotted" : "hidden",
                                                        borderWidth: 2,
                                                        backgroundColor: (item.type === "text" || item.type === "image" || item.type === "video" || item.type === "table") 
                                                                          ? "transparent" : "white",
                                                        borderColor: 'grey',
                                                        width: "fit-content"
                                                    }}

                                                    // intialize components x,y,height and width
                                                    position={{ x: item.x, y: item.y }}
                                                    size={{ width: item.width, height: item.height }}

                                                    // min height and size
                                                    minHeight={120} minWidth={135}

                                                    // to customize the dragging and resizing behavior
                                                    bounds={"parent"}
                                                    cancel={".nonDraggable"}
                                                    dragHandleClassName={this.state.editMode ? "draggable" : "cannotDrag"}
                                                    enableResizing={{
                                                        bottom: this.state.editMode,
                                                        bottomLeft: this.state.editMode,
                                                        bottomRight: this.state.editMode,
                                                        left: this.state.editMode,
                                                        right: this.state.editMode,
                                                        top: this.state.editMode,
                                                        topLeft: this.state.editMode,
                                                        topRight: this.state.editMode
                                                    }}

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
                                                        <i style={{ marginTop: 10, marginRight: 6, visibility: this.state.editMode ? "" : "hidden" }} className="fa fa-wrench"
                                                            onClick={() => this.changeSettings(i)}></i>
                                                        <i style={{ marginTop: 10, marginRight: 10, visibility: this.state.editMode ? "" : "hidden" }} className="fa fa-times"
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
            </div>
        );
    }
}

export default App3;