import React, { Component } from 'react';

import $ from 'jquery'
import 'jplayer'
import { MUSIC_LIST } from './musicSrc'
// import logo from './logo.svg';
// import './App.css';
import Header from './component/header'
import Player from './component/player'
import MusicList from './component/musicList'
import Pubsub from 'pubsub-js'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

const repeatList = ['cycle', 'once', 'random'];
// import Progress from './component/progress'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[0],
      repeatType: 'cycle'
    }
  }
  playMusic = (musicItem) => {
    $('#player').jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');
    this.setState({
      currentMusicItem: musicItem
    })
  }
  playToggle = (type = 'next') => {
    let index = this.state.musicList.indexOf(this.state.currentMusicItem);
    let newIndex = null;
    if (type === 'next') {
      newIndex = (index + 1) % (this.state.musicList.length);
    } else if (type === 'prev') {
      newIndex = (index - 1 + this.state.musicList.length) % (this.state.musicList.length)
    }
    // if (newIndex === 0) {
    //   this.playMusic(null)
    // } else {
    //   this.playMusic(this.state.musicList[newIndex]);
    // }
    //当删除最后一项时，默认让播放器播放最后一首音乐
    this.playMusic(this.state.musicList[newIndex]);

  }
  playWhenEnd = () => {
    if (this.state.repeatType === 'cycle') {
      this.playToggle();
    } else if (this.state.repeatType === 'once') {
      this.playMusic(this.state.currentMusicItem)
    } else if (this.state.repeatType === 'random') {
      let newIndex = Math.floor(Math.random() * this.state.musicList.length);
      this.playMusic(this.state.musicList[newIndex]);
    }
  }
  componentDidMount() {
    $('#player').jPlayer({
      // ready:function(){
      //   $(this).jPlayer('setMedia',{
      //     mp3:'http://oj4t8z2d5.bkt.clouddn.com/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E' +
      //               '4%BD%BF.mp3'
      //   }).jPlayer('play')
      // },
      supplied: 'mp3',
      wmode: 'window'
    })
    this.playMusic(this.state.currentMusicItem);
    $('#player').bind($.jPlayer.event.ended, (e) => {
      // this.playToggle();
      this.playWhenEnd();
    })
    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playToggle('prev')
    })
    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playToggle('next')
    })
    Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
      this.playMusic(musicItem)
    })
    Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
      if (musicItem === this.state.currentMusicItem) {
        this.playToggle();
      }
      this.setState({
        musicList: this.state.musicList.filter(item => item !== musicItem)
      })
    })
    Pubsub.subscribe("CHANGE_REPEAT", (msg, type) => {
      let index = repeatList.indexOf(type);
      index = (index + 1) % repeatList.length;
      this.setState({ repeatType: repeatList[index] })
    })
  }
  componentWillUnmount() {
    Pubsub.unsubscribe('PLAY_PREV');
    Pubsub.unsubscribe('PLAY_NEXT');
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('DELETE_MUSIC')
    Pubsub.unsubscribe('CHANGE_REPEAT')
    $('#player').unbind($.jPlayer.event.ended)
  }
  render() {
    return (
      <div className="App">
        <Header />
        {/*<Player currentMusicItem={this.state.currentMusicItem}/>*/}
        {/*<MusicList musicList={this.state.musicList} currentMusicItem={this.state.currentMusicItem}/>*/}
        {/*返回一个新的元素*/}
        {React.cloneElement(this.props.children, this.state)}
      </div>
    );
  }
}

export default () => {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Player}/>
        <Route path='/list' component={MusicList} />
      </Route>
    </Router>
  )
}
