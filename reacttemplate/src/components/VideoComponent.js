import React from 'react';

class VideoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            initialized: true,
            videoUrl: '', 
        };
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.properties.initialized != this.state.initialized){
            this.setState({initialized: nextProps.properties.initialized});
        }
    }

    loadVideo = (e) => {
        let videoUrl = e.target.value;
        this.setState({initialized: true, videoUrl: videoUrl});
        this.props.updateProperties({initialized: true, videoUrl: videoUrl}, this.props.i);

    }

    render() {
        return (
            <div className="draggable" style={{height:"100%", width:"100%"}}>
                {this.state.initialized ? 
                <video width="100%" height="calc(100% - 27.5px)" className="draggable">
                    <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"/>
                </video>
                : <div style={{border: "1px dotted grey", height:"100%"}}>
                    <input className="video" onChange={this.loadVideo} /><br/>
                    Please enter a embed video URL
                </div>}
            </div>
        );
    }
}

export default VideoComponent;