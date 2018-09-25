import '../bootstrap.css';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

class EmptyTable extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            columns: [{
                    dataField: 'col1',
                    text: 'Header 1',
                    headerEvents: {
                        onClick: this.handleClick,
                        onBlur: this.handleBlur
                    },
                }, {
                    dataField: 'col2',
                    text: 'Header 2',
                    headerEvents: {
                        onClick: this.handleClick,
                        onBlur: this.handleBlur
                    },
                }, {
                    dataField: 'delete',
                    text: 'Delete',
                    align: 'center',
                    editable: false,
                    hidden: false,
                    formatter: function(cell, row, rowIndex){
                        return <i className="fa fa-trash" onClick={() => self.delRow(rowIndex)}/>
                    }
                }],
            data: [{
                    id: 'row1',
                    col1: 'Some data',
                    col2: 'Some data',
                },{
                    id: 'row2',
                    col1: 'Some data',
                    col2: 'Some data'
                }],
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.editMode != nextProps.editMode){
            let columns = this.state.columns;
            columns[columns.length - 1].hidden = !columns[columns.length - 1].hidden;
            this.setState({columns});
        }
    }

    addRow = (e) => {
        let data = this.state.data;
        let new_data = {id:'example' + (data.length+1)}

        for (let i=1; i <= this.state.columns.length; i++){
            new_data["col" + i] = '';
        }

        data.push(new_data);
        this.setState({data})
    }

    delRow(rowIndex){
        let data = this.state.data;
        data.splice(rowIndex,1);
        
        // fix id referencing error        
        for(let i in data) {
            data[i].id = "row" + (i+1);
        }
        this.setState({data});
    }

    addCol = (e) => {
        let columns = this.state.columns;
        let data = this.state.data;

        // add new item to end of each table row (or else code will crash)
        for (let obj of data){
            obj["col" + columns.length] = '';
        }

        // add column to column, before the cancel column
        columns.splice(columns.length-1,0,{
            dataField: 'col' + columns.length,
            text: 'Header ' + columns.length,
            headerEvents: {
                onClick: this.handleClick,
                onBlur: this.handleBlur
            }
        });
        
        this.setState({columns, data})
    }

    handleClick = (e) => {
        let value = e.target.innerHTML;
        e.target.innerHTML = '<input value="' + value + '"/>';
        e.target.childNodes[0].focus();
    }

    handleBlur = (e) => {
        let parent = e.target.parentNode;
        parent.innerHTML = e.target.value;
    }

    render(){
        return (
            <div className="draggable">
                <Button bsSize="small" bsStyle="primary" style={{ padding:"4px 6px" }}
                    onClick={this.addRow}>Add Row</Button>
                <Button bsSize="small" bsStyle="primary" style={{ padding:"4px 6px" }}
                    onClick={this.addCol}>Add Col</Button>
                <BootstrapTable keyField='id' className="nonDraggable" 
                    striped responsive
                    data={ this.state.data } 
                    columns={ this.state.columns } 
                    cellEdit={ 
                        cellEditFactory({ 
                            blurToSave: true,
                            mode:'dbclick'
                        }) 
                    }
                />
            </div>
        );
    }
}

export default EmptyTable;