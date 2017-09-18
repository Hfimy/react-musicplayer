import React, { Component } from 'react'
import MusicItem from './musicItem'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import Header from './header'
import '../style/musicList.less'
class MusicList extends Component {
    render() {
        let listEle = null;
        listEle = this.props.musicList.map(item => {
            return (
                <MusicItem key={item.id} focus={item === this.props.currentMusicItem} musicItem={item} />
            )
        })
        return (
            <div>
                <Header bg='bg' />
                <div className='music-list'>
                    <ul>
                        {listEle}
                    </ul>
                    <div className='link'>
                        <Link to='/'>返回播放页</Link>
                    </div>

                </div>
            </div>
        )
    }
}

MusicList.propTypes = {
    musicList: PropTypes.array.isRequired
}
export default MusicList