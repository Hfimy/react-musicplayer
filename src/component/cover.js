import React,{Component} from 'react'
import '../style/cover.less'

export default class Cover extends Component {
    render(){
        return(
         <div>
           <div className="coverBox" style={{backgroundImage:`url(${this.props.bg})`}}></div>
           <div className="coverBg"></div>
         </div>
        )
    }
}