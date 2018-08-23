import React, { Component } from 'react';
import RichTextEditor from 'react-rte';

class Textbox extends Component {
    constructor(props) {
        super(props);
        // initialize state with what was passed by the props
        this.state = {
            // converts the markup value into the value used by this component
            editMode: this.props.editMode,
            value: RichTextEditor.createValueFromString(this.props.text, 'html'),
            htmlValue: this.props.text
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.editMode != nextProps.editMode){
            this.setState({editMode: nextProps.editMode});
        }
    }

    onChange = (value) => {
        // converts the value in state
        this.setState({value:value, htmlValue:value.toString('html')});
        this.props.updateProperties({text:this.state.htmlValue}, this.props.i);
    };

    render() {
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS','BLOCK_TYPE_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD'},
                {label: 'Italic', style: 'ITALIC'},
                {label: 'Underline', style: 'UNDERLINE'}
            ],
            BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item'},
                {label: 'OL', style: 'ordered-list-item'}
            ]
        };

        return(
            <RichTextEditor style={{border:"hidden"}}
                rootStyle={{height:"100%", minHeight:100, minWidth:150}}
                value={this.state.value}
                onChange={this.onChange}
                toolbarConfig={toolbarConfig}
                toolbarClassName={"draggable"}
                toolbarStyle={{display: this.state.editMode ? "" : "none"}}
            />
        );
    }
}

export default Textbox;

