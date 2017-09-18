import React, { Component } from 'react'
import Progress from './progress'
import PropTypes from 'prop-types'
import Cover from './cover'
import Header from './header'

import '../style/player.less'

import { Link } from 'react-router'

import Pubsub from 'pubsub-js'

let duration = null, lastVolume = null;

class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            volume: 0,
            progress: 0,
            isPlay: true,
            useTime: '',
            // imgStyle:''
            // volumeStyle: 'volume'
        }
    }
    componentDidMount() {
        $('#player').bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            // initVolume=e.jPlayer.options.volume*100;
            //  console.log(duration*(1-e.jPlayer.status.currentPercentAbsolute/100));
            // console.log(duration);输出为秒数
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                progress: e.jPlayer.status.currentPercentAbsolute,
                useTime: this.formatTime(duration * (e.jPlayer.status.currentPercentAbsolute / 100))
            })
            // console.log(this.state.volume)
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
        minutes=minutes<10?`0${minutes}`:`${minutes}`
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutes}:${seconds}`
    }
    changeProgress(progress) {
        //此处修复一个小bug
        if (this.state.isPlay) {
            $('#player').jPlayer('play', duration * progress)
        } else {
            $('#player').jPlayer('pause', duration * progress)
        }
    }
    changeVolume(progress) {
        $('#player').jPlayer('volume', progress);
        console.log(progress);
        this.setState({
            volume:progress*100
        })
        // this.setState({
        //     this.state
        // })
    }
    play() {
        if (this.state.isPlay) {
            $('#player').jPlayer('pause');
            // this.setState({
            //     imgStyle:'pause'
            // })
        } else {
            $('#player').jPlayer('play')
            // this.setState({
            //     imgStyle:''
            // })
            // $('#player').jPlayer('setMedia', {
            //     mp3: this.props.currentMusicItem.file
            // }).jPlayer('play');
        }
        // console.log(this.state.isPlay);
        this.setState({ isPlay: !this.state.isPlay })
    }
    playPrev() {
        if(!this.state.isPlay){
             Pubsub.publish('PLAY_PREV','pause')
        }else{
             Pubsub.publish('PLAY_PREV')
        }
       
    }
    playNext() {
        // Pubsub.publish('PLAY_NEXT')
         if(!this.state.isPlay){
             Pubsub.publish('PLAY_NEXT','pause')
        }else{
             Pubsub.publish('PLAY_NEXT')
        }
    }
    volumeHandler() {
        if (this.state.volume) {
            lastVolume = this.state.volume / 100;
            console.log(lastVolume)
            $('#player').jPlayer('volume', 0)
            this.setState({volume:0})
            // this.setState({ volumeStyle: 'nosound' })
            this.refs.volumn.innerHTML='/';
        } else {
            $('#player').jPlayer('volume', lastVolume)
            this.setState({volume:lastVolume*100})
            // this.setState({ volumeStyle: 'volume' })
            this.refs.volumn.innerHTML='';
        }
    }
    repeatTypeChange(type) {
        Pubsub.publish("CHANGE_REPEAT", type)
    }
    render() {
        return (
            <div>
                <Cover bg={this.props.currentMusicItem.cover}/>
                <Header/>
                <div className='player-container'>
                <div className='player'>
                    <h1 className='caption'><Link to='/list'>我的私人音乐坊 &gt;</Link></h1>
                    <div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ float: 'left' }}>
                                <h2 className='music-title'>{this.props.currentMusicItem.title}</h2>
                                <h3 className='music-artist'>{this.props.currentMusicItem.artist}</h3>
                                <div className='volume-container'>
                                    <div className='use-time'>{this.state.useTime}</div>
                                    <i className='icon-volume' ref='volumn' onClick={this.volumeHandler.bind(this)}></i>
                                    <div className="volume-wrapper">
                                        <Progress progress={this.state.volume}
                                            onChangeProgress={this.changeVolume.bind(this)}
                                            bgColor='#427'
                                            width="324" />
                                    </div>
                                </div>
                                <div className='progress-container'>
                                    <Progress
                                        progress={this.state.progress}
                                        onChangeProgress={this.changeProgress.bind(this)} />
                                </div>
                                <div style={{ width: 400, float: 'left' }}>
                                    <i className='icon icon-prev' onClick={this.playPrev.bind(this)}></i>
                                    <i className={`icon icon-${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                                    <i className='icon icon-next' onClick={this.playNext.bind(this)}></i>
                                    <i className={`icon icon-${this.props.repeatType} repeat`} onClick={this.repeatTypeChange.bind(this, this.props.repeatType)}></i>
                                </div>
                            </div>
                            <div className='cover'>
                                <img className={`${this.state.isPlay?'':'pause'}`} src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            </div>

        )
    }
}
Player.propTypes = {
    currentMusicItem: PropTypes.object.isRequired,
    repeatType: PropTypes.string.isRequired
}
export default Player