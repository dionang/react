import React from 'react';

class VideoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            initialized: this.props.properties.initialized,
            videoUrl: this.props.properties.videoUrl,
        };
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.properties.initialized != this.state.initialized){
            this.setState({
                initialized:nextProps.properties.initialized, 
                videoUrl: nextProps.properties.videoUrl
            });
        }
    }

    loadVideo = (e) => {
        let videoUrl = document.getElementById("videoUrl").value.trim();
        this.setState({initialized: true, videoUrl: videoUrl});
        this.props.updateProperties({initialized: true, videoUrl: videoUrl}, this.props.i);
    }

    render() {
        return (
            <div className="draggable" style={{height:"100%", width:"100%"}}>
                {this.state.initialized ? 
                    <iframe style={{width:"100%", height:"calc(100% - 27.5px)"}} 
                        src={this.state.videoUrl} frameBorder="0" allow="encrypted-media" allowFullScreen>
                    </iframe>
                : <div style={{height:"100%", display:"flex"}}>
                    <input id="videoUrl" className="nonDraggable" placeholder="Please enter a embed video URL" 
                        style={{margin:"auto", width:"80%"}}/>
                    <button style={{margin:"auto"}} onClick={this.loadVideo}>Submit</button>
                </div>}
            </div>
        );
    }
}

export default VideoComponent;