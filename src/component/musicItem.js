import React,{Component} from 'react'
import Pubsub from 'pubsub-js'
import '../style/musicItem.less'
import {browserHistory} from 'react-router'
import PropTypes from 'prop-types'
class MusicItem extends Component{
    playMusic(musicItem){
        Pubsub.publish('PLAY_MUSIC',musicItem);
        browserHistory.push('/')
    }
    deleteMusic(musicItem,event){
        event.stopPropagation();//阻止事件冒泡
        Pubsub.publish('DELETE_MUSIC',musicItem)
    }
    //注意：下面赋给onClick的应该是一个函数的句柄，而不是一个立即执行的函数，所以不能直接传参，通过使用bind来绑定作用域再传参，返回一个新函数
    render(){
        let musicItem=this.props.musicItem
        return(
            <li onDoubleClick={this.playMusic.bind(this,musicItem)} className={`${this.props.focus?'focus':''}`}>
                <span>{musicItem.title}--{musicItem.artist}</span>
                <input type="button" value='Delete' onClick={this.deleteMusic.bind(this,musicItem)}/>
            </li>
        )
    }
}

MusicItem.propTypes={
    musicItem:PropTypes.object.isRequired
}

export default MusicItem