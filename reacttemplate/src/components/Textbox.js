import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import {ResponsiveContainer} from 'recharts';

class Textbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: RichTextEditor.createValueFromString(this.props.text, 'html'),
            htmlValue: this.props.text
        }
    }

    onChange = (value) => {
        this.setState({value:value, htmlValue:value.toString('html')});
        console.log(value.toString('html'));
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
                onChange={this.onChange}
                toolbarConfig={toolbarConfig}
                style={{width:"100%", height:"100%"}}
            />
        );
    }
}

export default Textbox;

