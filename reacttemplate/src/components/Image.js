import React from 'react';
import Img from 'react-image'

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            file: '', 
            imageUrl: this.props.properties.imageUrl, 
        };
    }

    imageChange = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imageUrl: reader.result,
            });
            this.props.updateProperties({imageUrl: reader.result}, this.props.i);
        }

        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div className="draggable" style={{height:"100%", width:"100%"}}>
                {this.state.imageUrl ? <Img style={{height:"100%", width:"100%"}} src={this.state.imageUrl} />
                : <div>
                    <input className="fileInput" type="file" onChange={this.imageChange} /><br/>
                    Please select an Image for Preview
                </div>}
            </div>
        );
    }
}

export default Image;