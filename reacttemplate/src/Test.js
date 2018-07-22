import React, { Component } from 'react';
import Rnd from 'react-rnd';
import Textbox from './components/Textbox';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // initial state has two line charts
            components: [
                {type:"text", x:10, y:320, height:50, width:200, properties:{text:"<p>Hello World!</p>"}}
            ]
        }
    }

    getComponentDetails = () => {
        console.log(this.state.components);
    }

    // i represents index of current item in this.state.components
    // convert style data to integer. e.g. 10px -> 10
    onResizeStop (ref, i){
        let components = this.state.components;
        components[i].height = parseInt(ref.style.height,10);
        components[i].width = parseInt(ref.style.width,10);
        this.setState({components});
        console.log(components);
    }

    onDragStop (ref, i){
        let components = this.state.components;
        components[i].x = ref.x;
        components[i].y = ref.y;
        this.setState({components});
        console.log(components);
    }

    updateProperties = (properties, i) => {
        let components = this.state.components;
        components[i].properties = properties;
        this.setState({properties});
    }

    render() {
        return (
            <Rnd dragHandleClassName={"dragHandle"}> 
                <div style={{height:20,width:20,backgroundColor:"blue",float:"right"}} className="dragHandle"></div>
                <Textbox i={0} text="<p>Hello World!</p>" updateProperties={this.updateProperties.bind(this)}/>
            </Rnd>
        ) 
    }
}

export default Test;