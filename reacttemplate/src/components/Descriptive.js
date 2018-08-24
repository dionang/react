import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import cellEditFactory from 'react-bootstrap-table2-editor';
import TableForm from './TableForm';
import request from 'request';
import JsonProcessor from './JsonProcessor';
import { SplitButton, FormGroup, FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Row, Col, Grid, Button } from 'react-bootstrap';
import '../bootstrap.css';
import { link } from 'fs';

class Descriptive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            columns: 
            [{
                dataField: 'Sum',
                text:<div>Sum <i style={{marginTop:10, marginRight:10, marginRight:4}} className="fa fa-times" onClick={() => this.delete(1)}></i></div>,
                
            }],
            order: 1,
            aggregateType: 'Sum',
        }
    }

    // update state of initialized when props change
    /*componentWillReceiveProps(nextProps){
        if (nextProps.properties.initialized != this.state.initialized){
            this.setState({initialized: nextProps.properties.initialized});
        }
    }*/


    
    addCol = (e) => {
        let columns = this.state.columns;
        let order = this.state.order+1;

        if (e === "Median") {
            columns.push({
                dataField: 'Median',
                text:
                <div>Median<i style={{marginTop:10, marginRight:10, marginRight:4}} className="fa fa-times" onClick={() => this.delete(order)}></i></div>,
                
            });
            

        } else if (e === "Min") {
            columns.push({
                dataField: 'Min',
                text: 
                <div>Min <i style={{marginTop:10, marginRight:10, marginRight:4}} className="fa fa-times" onClick={() => this.delete(order)}></i></div>,
                

            });
        } else {
            columns.push({
                dataField: 'Max',
                text:  
                <div>Max<i style={{marginTop:10, marginRight:10, marginRight:4}} className="fa fa-times" onClick={() => this.delete(order)}></i></div>,
                

            });
        }

        this.setState({ columns,order });
        
    }

    delete(e){
        console.log(e);
        const columns = this.state.columns ;
        delete columns[(e-1)];
        //console.log(col);
        this.setState({columns});
    }


    render() {
        const columns = [{
            dataField: 'Sum',
            text: 'Sum'
          }, {
            dataField: 'Average',
            text: 'Average'
          }, {
            dataField: 'Max',
            text: 'Max'
          },{
            dataField: 'Min',
            text: 'Min'
          },{
            dataField: 'Median',
            text: 'Median'
          }];


        var products = [{
            Sum: this.props.summaryData.total,
            Median: 30,
            Average: this.props.summaryData.average,
            Min: this.props.summaryData.min,
            Max:this.props.summaryData.max,
        }];

        const rowStyle = { backgroundColor: '#D3D3D3' };
        const { value, onUpdate, ...rest } = this.props;
        
        // loop through the columns to remove the empty items
        const actualTitle = [];
        for (var i=0; i < this.state.columns.length; i++) {
            if(this.state.columns[i] !== undefined){
                actualTitle.push(this.state.columns[i]);
            }
        }

        
            return (
            <div  className="draggable" height="100%">
                
                <BootstrapTable keyField='id' data={products}
                    columns={columns}
                    //cellEdit={cellEditFactory({ mode: 'dbclick' })}
                    rowStyle={rowStyle}>
                   
                    
                </BootstrapTable>
                </div>)

            
    }
}

export default Descriptive;