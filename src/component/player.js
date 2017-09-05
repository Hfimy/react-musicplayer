import React, { Component } from 'react'
import Progress from './progress'
import PropTypes from 'prop-types'
import $ from 'jquery'
import 'jplayer'
import '../style/player.less'

import { Link } from 'react-router'

import Pubsub from 'pubsub-js'

let duration = null,lastVolume=null;

class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            volume: 0,
            progress: 0,
            isPlay: true,
            leftTime: '',
            volumeStyle:'volume'
        }
    }
    componentDidMount() {
        $('#player').bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration
            //  console.log(duration*(1-e.jPlayer.status.currentPercentAbsolute/100));
            // console.log(duration);输出为秒数
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                progress: e.jPlayer.status.currentPercentAbsolute,
                leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            })
        })
        // console.log(this.formatTime(181.1));
        // console.log(this.leftTime);

    }
    componentWillUnmount() {
        $('#player').unbind($.jPlayer.event.timeupdate)
    }
    formatTime(time = 0) {
        time = Math.floor(time)//向下取整
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutes}:${seconds}`
    }
    changeProgress(progress) {
        $('#player').jPlayer('play', duration * progress)
    }
    changeVolume(progress) {
        $('#player').jPlayer('volume', progress)
    }
    play() {
        if (this.state.isPlay) {
            $('#player').jPlayer('pause')
        } else {
            $('#player').jPlayer('play')
            // $('#player').jPlayer('setMedia', {
            //     mp3: this.props.currentMusicItem.file
            // }).jPlayer('play');
        }
        // console.log(this.state.isPlay);
        this.setState({ isPlay: !this.state.isPlay })
    }
    playPrev() {
        Pubsub.publish('PLAY_PREV')
    }
    playNext() {
        Pubsub.publish('PLAY_NEXT')
    }
    volumeHandler=()=> {
        if (this.state.volume) {
            lastVolume=this.state.volume/100;
            $('#player').jPlayer('volume', 0)
            this.setState({volumeStyle:'nosound'})
        }else{
            $('#player').jPlayer('volume', lastVolume)
            this.setState({volumeStyle:'volume'})
        }
    }
    repeatTypeChange(type){
        Pubsub.publish("CHANGE_REPEAT",type)
    }
    render() {
        return (
            <div className='player'>
                <h1><Link to='/list'>我的私人音乐坊 &gt;</Link></h1>
                <div>
                    <div>
                        <h2>{this.props.currentMusicItem.title}</h2>
                        <h3>{this.props.currentMusicItem.artist}</h3>
                        <div>
                            <div>-{this.state.leftTime}</div>
                            <i className={`icon-${this.state.volumeStyle}`} onClick={this.volumeHandler}></i>
                            <Progress progress={this.state.volume}
                                onChangeProgress={this.changeVolume}
                                bgColor='#22e' />
                        </div>
                        <Progress
                            progress={this.state.progress}
                            onChangeProgress={this.changeProgress} />
                        <div>
                            <i onClick={this.playPrev}>&lt;</i>
                            <i onClick={this.play.bind(this)}>播放/暂停</i>
                            <i onClick={this.playNext}>&gt;</i>
                            <i className={`icon-${this.props.repeatType}`} onClick={this.repeatTypeChange.bind(this,this.props.repeatType)}></i>
                        </div>
                    </div>
                    <div>
                        <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title} />
                    </div>
                </div>
            </div>
        )
    }
}
Player.propTypes={
    currentMusicItem:PropTypes.object.isRequired,
    repeatType:PropTypes.string.isRequired
}
export default Player