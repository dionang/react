import React from 'react';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            imageUrl: this.props.properties.imageUrl, 
        };
    }

    imageChange = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({imageUrl: reader.result});
            this.props.updateProperties({imageUrl: reader.result}, this.props.i);
        }

        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div className="draggable" style={{height:"100%", width:"100%"}}>
                {this.state.imageUrl ? 
                <img style={{height:"calc(100% - 27.5px)", width:"100%"}} 
                    src={this.state.imageUrl} 
                />
                : <div style={{border: "1px dotted grey", height:"100%"}}>
                    <input className="fileInput" type="file" onChange={this.imageChange} /><br/>
                    Please select an Image for Preview
                </div>}
            </div>
        );
    }
}

export default Image;