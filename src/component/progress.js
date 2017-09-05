import React,{Component} from 'react'
import '../style/progress.less'
import PropTypes from 'prop-types'
class Progress extends Component{
    changeProgress(e){
        const element=this.refs.progress;
        let progress=(e.clientX-element.getBoundingClientRect().left)/element.clientWidth;
        // console.log(progress);

        this.props.onChangeProgress(progress)
    }
    render(){
        return(
            <div className='progress-bar' ref='progress' onClick={this.changeProgress.bind(this)}>
                <div className='progress' style={{width:`${this.props.progress}%`,backgroundColor:`${this.props.bgColor}`}}></div>
            </div>
        )
    }
}

Progress.propTypes={
    progress:PropTypes.number,
    bgColor:PropTypes.string,
    onChangeProgress:PropTypes.func
}
Progress.defaultProps={
    progress:0,
    bgColor:"#e11",
    onChangeProgress:f=>f
}
export default Progress
