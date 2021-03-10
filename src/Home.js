import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './App.css'


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false
        }
    }

    componentDidMount() {
        console.log(this.props.location.state);
        if (this.props.location.state !== undefined){
            this.setState({redirect: this.props.location.state.redirect});
        }
    }

    render() {
        return (
            <>{
                this.state.redirect ? 
                <div className="account-created-text">
                    <p>Account was successfully created. Please log in now.</p>
                </div>
                :
                <p></p>
            }</>
        )
    }
  }

  export default withRouter(Home);