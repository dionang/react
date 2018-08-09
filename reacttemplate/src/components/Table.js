import BootstrapTable from 'react-bootstrap-table-next';
import React, {Component} from "react";
import cellEditFactory from 'react-bootstrap-table2-editor';
import TableForm from './TableForm';
import request from 'request';
import JsonProcessor from './JsonProcessor';
import { SplitButton, FormGroup, FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Row, Col, Grid, Button } from 'react-bootstrap';
import '../bootstrap.css';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData: [],
            columns: [{
                dataField: 'id',
                text: 'Product ID',
                sort: true
            }],
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
        let col = this.state.columns;
        if (e === "name") {
            col.push({
                dataField: 'name',
                text: 'Product Name',
                sort: true

            });

        } else if(e==="price") {
            col.push({
                dataField: 'price',
                text: 'Product Price',
                sort: true

            });
        } else {
            col.push({
                dataField: 'id',
                text: 'Product ID',
                sort: true

            });
        }

        this.setState({ col });
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
        return this.state.initialized ?
            <div>
                <ButtonToolbar>
                    <SplitButton title="Add a Column" bsStyle="info" dropup id="split-button-dropup" onSelect={this.addCol}>
                        Categories
                        <MenuItem eventKey="id">Product ID</MenuItem>
                        <MenuItem eventKey="name">Product Name</MenuItem>
                        <MenuItem eventKey="price">Product Price</MenuItem>
                    </SplitButton>
                </ButtonToolbar>

                <BootstrapTable keyField='id' data={products}
                    columns={this.state.columns}
                    cellEdit={cellEditFactory({ mode: 'dbclick' })}
                    rowStyle={rowStyle}>
                </BootstrapTable>



            </div>
            : <TableForm initializeTable={this.initializeTable} />
    }
}

export default Table;