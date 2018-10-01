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
            editMode: this.props.editMode,
            columns: [{
                    dataField: 'col1',
                    text: 'Header 1',
                    headerEvents: {
                        onClick: this.handleClick,
                        onBlur: (e) => this.handleBlur(e,0)
                    }
                }, {
                    dataField: 'col2',
                    text: 'Header 2',
                    headerEvents: {
                        onClick: this.handleClick,
                        onBlur: (e) => this.handleBlur(e,1)
                    }
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
                    col1: '',
                    col2: ''
                },{
                    id: 'row2',
                    col1: '',
                    col2: ''
                }],
        }
    }

    componentWillMount(){
        let self = this;
        let columns = this.props.properties.columns;
        let new_columns = [];

        for (let i in columns) {
            new_columns.push({
                dataField:columns[i].dataField, 
                text:columns[i].text, 
                headerEvents:{
                    onClick: this.handleClick,
                    onBlur: (e) => this.handleBlur(e,i)
                }
            }) 
        }

        // add the delete column
        new_columns.push({
            dataField: 'delete',
            text: 'Delete',
            align: 'center',
            editable: false,
            hidden: false,
            formatter: function(cell, row, rowIndex){
                return <i className="fa fa-trash" onClick={() => self.delRow(rowIndex)}/>
            }
        });

        this.setState({columns: new_columns, data:this.props.properties.data})
    }

    componentWillReceiveProps(nextProps){
        if(this.props.editMode != nextProps.editMode){
            let columns = this.state.columns;
            columns[columns.length - 1].hidden = !columns[columns.length - 1].hidden;
            this.setState({columns, editMode:nextProps.editMode});
        }
    }

    addRow = (e) => {
        let self = this;
        let data = this.state.data;
        let new_data = {id:'row' + (data.length+1)}

        for (let i=1; i < this.state.columns.length; i++){
            new_data["col" + i] = '';
        }

        data.push(new_data);
        this.setState({data})

        setTimeout(function () {
            self.updateProperties();
        }, 100);
    }

    delRow(rowIndex){
        let data = this.state.data;
        data.splice(rowIndex,1);
        
        // fix id referencing error        
        for(let i=0; i < data.length; i++) {
            data[i].id = "row" + (i+1);
        }
        this.setState({data});
    }

    addCol = (e) => {
        let self = this;
        let columns = this.state.columns;
        let new_columns = [];
        let data = this.state.data;

        // add new item to end of each table row (or else code will crash)
        for (let obj of data){
            obj["col" + columns.length] = '';
        }

        for (let i in columns) {
            let column = columns[i];

            // push the new column before the cancel column
            if(i == columns.length - 1) {
                new_columns.push({
                    dataField: 'col' + columns.length,
                    text: 'Header ' + columns.length,
                    headerEvents: {
                        onClick: this.handleClick,
                        onBlur: (e) => this.handleBlur(e,columns.length-1)
                    }
                })
            }

            new_columns.push(column);
        }

        this.setState({columns: new_columns, data});

        setTimeout(function() {
            self.updateProperties();
        }, 100);
    }

    handleClick = (e) => {
        let value = e.target.innerHTML;
        e.target.innerHTML = '<input class="nonDraggable" value="' + value + '"/>';
        e.target.childNodes[0].focus();
    }

    handleBlur(e, i) {
        let self = this;
        let parent = e.target.parentNode;
        let columns = this.state.columns;

        parent.innerHTML = e.target.value;
        columns[i].text = e.target.value;

        this.setState({columns});
        setTimeout(function() {
            self.updateProperties();
        }, 100);
    }

    updateProperties() {
        let columns = this.state.columns;
        let new_columns = [];
        for (let i in columns) {
            let column = columns[i];
            if(i != columns.length - 1) {
                new_columns.push({dataField:column.dataField, text:column.text})
            }
        }
        this.props.updateProperties({columns:new_columns, data:this.state.data}, this.props.i);
    }

    render(){
        return (
            <div className="draggable">
                <Button bsSize="small" bsStyle="primary" style={{ display:this.state.editMode ? "inline-block" : "none", padding:"4px 6px" }}
                    onClick={this.addRow}>Add Row</Button>
                <Button bsSize="small" bsStyle="primary" style={{ display:this.state.editMode ? "inline-block" : "none", padding:"4px 6px" }}
                    onClick={this.addCol}>Add Col</Button>
                <BootstrapTable keyField='id' className="nonDraggable" 
                    striped responsive
                    data={ this.state.data } 
                    columns={ this.state.columns } 
                    cellEdit={ 
                        cellEditFactory({ 
                            blurToSave: true,
                            mode:'click'
                        }) 
                    }
                />
            </div>
        );
    }
}

export default EmptyTable;