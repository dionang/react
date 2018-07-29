import React, { Component } from 'react';
import RichTextEditor from 'react-rte';

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

    onChange = (value) => {
        // converts the value in state
        let htmlValue = value.toString('html');
        this.setState({value:value, htmlValue:htmlValue});
        this.props.updateProperties({text:htmlValue}, this.props.i);
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
                rootStyle={{height:"calc(100% - 2px)", minHeight:80, minWidth:120}}
                value={this.state.value}
                onChange={this.onChange}
                toolbarConfig={toolbarConfig}
                toolbarClassName={"draggable"}
            />
        );
    }
}

export default Textbox;

