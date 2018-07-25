import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import {ResponsiveContainer} from 'recharts';

class Textbox extends Component {
    constructor(props) {
        super(props);
        // initialize state with what was passed by the props
        this.state = {
            // converts the markup value into the value used by this component
            value: RichTextEditor.createValueFromString(this.props.text, 'html'),
            htmlValue: this.props.text
        }
    }

    onChange(value){
        // converts the value in state
        this.setState({value:value, htmlValue:value.toString('html')});
        this.props.updateProperties({text:this.state.htmlValue}, this.props.i);
    };

    render() {
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
              {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
              {label: 'Italic', style: 'ITALIC'},
              {label: 'Underline', style: 'UNDERLINE'}
            ]
        };

        return(
            <RichTextEditor
                value={this.state.value}
                onChange={(e)=>this.onChange(e)}
                toolbarConfig={toolbarConfig}
                toolbarClassName={"dragHandle"}
                style={{width:"100%", height:"100%"}}
            />
        );
    }
}

export default Textbox;

