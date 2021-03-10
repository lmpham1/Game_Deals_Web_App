import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import GameSearch from './GameSearch';
import './App.css'


class Search extends Component {
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
          <div className="md-form active-purple active-purple-2 mb-3">
            <h1>Find the best game deals</h1>
            <hr/>
            <GameSearch loggedIn={this.props.loggedIn} user={this.props.user}></GameSearch>
            {
                this.state.redirect ? 
                <div className="account-created-text">
                    <p>Account was successfully created. Please log in now.</p>
                </div>
                :
                <p></p>
            }
          </div>
        )
    }
  }

  export default withRouter(Search);