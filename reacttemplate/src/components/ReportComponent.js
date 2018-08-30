import React, { Component } from 'react';
import Textbox from './Textbox';
import Barchart from './Barchart';
import Linechart from './Linechart';
import Image from './Image';
import Table from './Table';
import Descriptive from './Descriptive';

class ReportComponent extends Component {
    render() {
        // based on the item type, render a type of component
        if (this.props.type === "line") {
            return(
                <Linechart i={this.props.i} properties={this.props.properties} updateProperties={this.props.updateProperties}/>
            );
        } else if (this.props.type === "bar") {
            return (
                <Barchart i={this.props.i} properties={this.props.properties} updateProperties={this.props.updateProperties}/>
            );
        } else if (this.props.type === "text") {
            return(
                <Textbox i={this.props.i} text={this.props.properties.text} editMode={this.props.editMode}
                    updateProperties={this.props.updateProperties} />
            );
        } else if (this.props.type ==="image"){
            return(
                <Image i={this.props.i}  editMode={this.props.editMode} 
                    properties={this.props.properties} updateProperties={this.props.updateProperties}/>
            );
        } else if (this.props.type ==="table"){
            return(
                <Table/>
            );
        } else if (this.props.type === "video") {
            return(
                <Textbox i={this.props.i} text={this.props.properties.text} editMode={false}
                    updateProperties={this.props.updateProperties} />
            );
        }
    }
}

export default ReportComponent;

