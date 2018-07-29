import React from 'react';
import Img from 'react-image'
import Rnd from 'react-rnd';

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { file: '', imagePreviewUrl: '', initialized:'false' };
    }

    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result,
                initialized:true
            });
        }

        reader.readAsDataURL(file)
    }

    
    onSubmit = () =>{
        let components = this.state.components;
        components.push(
            {type:"image", x:0, y:0, height:200, width:200}
        );
        this.setState({components, initialized:true});
    }


    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            return(
            <Img className="draggable previewComponent" style={{height:"100%", width:"100%"}} src={imagePreviewUrl} />
            )
        } else {
            return(
            <div className="draggable previewComponent" style={{height:"100%", width:"100%"}}>
                <form onSubmit={(e) => this._handleSubmit(e)}>
                    <input className="fileInput"
                        type="file"
                        onChange={(e) => this._handleImageChange(e)} />
                    
                </form>
                <div className="imgPreview">
                <div className="previewText">Please select an Image for Preview</div>
                </div>
            </div>
            )

            
        }

       
    }
}

export default UploadImage;