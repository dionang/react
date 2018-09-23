import React from 'react';

class VideoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            initialized: this.props.initialized,
            videoUrl: '',
        };
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.properties.initialized != this.state.initialized){
            this.setState({initialized: nextProps.properties.initialized});
        }
    }

    loadVideo = (e) => {
        let videoUrl = document.getElementById("videoUrl").value.trim();
        this.setState({initialized: true, videoUrl: videoUrl});
        console.log(videoUrl);
        this.props.updateProperties({initialized: true, videoUrl: videoUrl}, this.props.i);
    }

    render() {
        return (
            <div style={{height:"100%", width:"100%"}}>
                {this.state.initialized ? 
                <video className="draggable" id="player" controls
                    // src="http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4"
                    src={this.state.videoUrl}
                    width="100%"
                    style={{height:"calc(100% - 27.5px)"}}>
                </video>
                : <div style={{height:"100%", display:"flex"}} className="draggable">
                    <input id="videoUrl" className="nonDraggable" placeholder="Please enter a embed video URL" 
                        style={{margin:"auto", width:"80%"}}/>
                    <button style={{margin:"auto"}} onClick={this.loadVideo}>Submit</button>
                </div>}
            </div>
        );
    }
}

export default VideoComponent;