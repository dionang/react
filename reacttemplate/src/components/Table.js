import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import cellEditFactory from 'react-bootstrap-table2-editor';
import TableForm from './TableForm';
import request from 'request';
import JsonProcessor from './JsonProcessor';
import { SplitButton, FormGroup, FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Row, Col, Grid, Button } from 'react-bootstrap';
import '../bootstrap.css';
import { link } from 'fs';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData: [],
            columns: [{
                dataField: 'id',
                text: 
            <SplitButton title="Product ID" bsStyle="default" dropup id="split-button-dropup" onSelect={this.delete}>
                <MenuItem eventKey="1">Delete</MenuItem>
            </SplitButton>,
                sort: true
            }],
            order: 1
        }
    }

    // update state of initialized when props change
    /*componentWillReceiveProps(nextProps){
        if (nextProps.properties.initialized != this.state.initialized){
            this.setState({initialized: nextProps.properties.initialized});
        }
    }*/

    initializeTable = (values) => {
        //set settings of barchart
        console.log("init table")
        let processor = values.processor;
        let datasourceUrl = values.datasourceUrl;
        let dataset = values.dataset;
        let data = processor.getDataset(dataset);

        this.setState({
            initialized: true,
            datasourceUrl: datasourceUrl,
            dataset: dataset,
            chartData: data
        })

        // sending all data to app2 other than chartData
        //let {chartData, ...other} = this.state;
        //this.props.updateProperties(other, this.props.i);
    }

    
    addCol = (e) => {
        let columns = this.state.columns;
        let order = this.state.order+1;

        if (e === "name") {
            columns.push({
                dataField: 'name',
                text: 
                <SplitButton title="Product Name" bsStyle="default" dropup id="split-button-dropup" onSelect={this.delete}>
                <MenuItem eventKey={order}>Delete</MenuItem>
            </SplitButton>,
                sort: true,
            });
            

        } else if (e === "price") {
            columns.push({
                dataField: 'price',
                text: 
                <SplitButton title="Product Price" bsStyle="default" dropup id="split-button-dropup" onSelect={this.delete}>
                <MenuItem eventKey={order}>Delete</MenuItem>
            </SplitButton>,
                sort: true

            });
        } else {
            columns.push({
                dataField: 'id',
                text: 
                <SplitButton title="Product ID" bsStyle="default" dropup id="split-button-dropup" onSelect={this.delete}>
                <MenuItem eventKey={order}>Delete</MenuItem>
            </SplitButton>,
                sort: true

            });
        }

        this.setState({ columns,order });
        
    }

    delete = (e)=>{
        //console.log(e);
        const columns = this.state.columns ;
        delete columns[(e-1)];
        //console.log(col);
        this.setState({columns});
    }


    render() {
        var products = [{
            id: 1,
            name: "Product1",
            price: 120
        }, {
            id: 2,
            name: "Product2",
            price: 80
        }, {
            id: 3,
            name: "Product1",
            price: 120
        }, {
            id: 4,
            name: "Product2",
            price: 80
        }, {
            id: 5,
            name: "Product1",
            price: 120
        }];

        const rowStyle = { backgroundColor: '#c8e6c9' };
        const { value, onUpdate, ...rest } = this.props;
        
        // loop through the columns to remove the empty items
        const actualTitle = [];
        console.log("LOOP START HERE");
        for (var i=0; i < this.state.columns.length; i++) {
            console.log("i" + i);
            if(this.state.columns[i] !== undefined){
                console.log(this.state.columns[i]);
                actualTitle.push(this.state.columns[i]);
            }
        }

        console.log("ACTUAL ONE"+ actualTitle);

        return this.state.initialized ?
        
            <div  className="draggable">
                <ButtonToolbar >
                    <SplitButton title="Add a Column" bsStyle="info" dropup id="split-button-dropup" onSelect={this.addCol}>
                        Categories
                        <MenuItem eventKey="id">Product ID</MenuItem>
                        <MenuItem eventKey="name">Product Name</MenuItem>
                        <MenuItem eventKey="price">Product Price</MenuItem>
                    </SplitButton>
                </ButtonToolbar>

                

                <BootstrapTable keyField='id' data={products}
                    columns={actualTitle}
                    //cellEdit={cellEditFactory({ mode: 'dbclick' })}
                    rowStyle={rowStyle}>
                    
                </BootstrapTable>



            </div>
            : <TableForm initializeTable={this.initializeTable} />
    }
}

export default Table;