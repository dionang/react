import React, { Component } from 'react';
import {ResponsiveContainer} from 'recharts';
import Textbox from './Textbox';
import BasicForm from './Form';
import Barchart from './Barchart';
import Linechart from './Linechart';
import Image from './Image';
import BasicTable from './BasicTable';

class ReportComponent extends Component {
    render() {
        // based on the item type, render a type of component
        if (this.props.type === "line") {
            return(
                <Linechart data={this.props.data}/>
            );
        } else if (this.props.type === "bar") {
            return (
                <Barchart/>
            );
        } else if (this.props.type === "text") {
            return(
                <Textbox i={this.props.i} text={this.props.properties.text} 
                    updateProperties={this.props.updateProperties} />
            );
        } else if (this.props.type === "basic"){
            return(
                <BasicForm/>
            )
        } else if (this.props.type ==="image"){
            return(
                <Image className = "draggable"/>
            )
        } else if (this.props.type ==="table"){
            return(
            <ResponsiveContainer className="draggable" height="100%" width="100%" boarder="none">
                <BasicTable/>
            </ResponsiveContainer>
            )
        }
    }
}

export default ReportComponent;

