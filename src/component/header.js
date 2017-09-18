import React,{Component} from 'react'
import '../style/header.less'

export default class Header extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className={`header ${this.props.bg}`}>
                <img src="./public/image/logo.png" alt="logo" width='40' />
                <h1>Music player build by React</h1>
            </div>
        )
    }
}