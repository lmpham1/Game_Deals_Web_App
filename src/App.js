import './App.css';
import React, { Component, useState } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import GameDetail from './GameDetail';
import LoginUser from './loginUser';
import NavBar from './navBar';
import Whishlist from './wishlist';
import Register from './Register';
import Home from './Home';
import Axios from 'axios';

//Routing setup
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loggedIn: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    //call to check on refresh, like F5
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8080/user",
    }).then((res) => {
      if (res.data._id) {
        this.setState({ loggedIn: true });
      }
      else {
        this.setState({ loggedIn: false });
      }
    });
  }
  componentDidMount() {
    //this.addToDatabase();
  }

  /*
  async addToDatabase(){
    for(let i = 1521; i >= 0; i++){
      console.log(i);
      await fetch(`https://www.cheapshark.com/api/1.0/deals?pageNumber=${i}`).then(response =>{
        if (response.ok){
            return response.json();
        }
        else if (response.status === 404){
            throw Error("HTTP 404, Not Found");
        } else {
            throw Error(`HTTP ${response.status}, ${response.statusText}`);
        }
      }).then(responseData => {
        if (responseData && responseData.length != 0){
          responseData.forEach(deal => {
            deal.external = deal.title;
            fetch(`http://localhost:8080/api/db/update`, {
              method: 'PUT',
              mode: 'cors',
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin':'*'
                },
              body: JSON.stringify(deal)
            }).then(response =>{
              if (response.ok){
                  return response.json();
              }
              else if (response.status === 404){
                  throw Error("HTTP 404, Not Found");
              } else {
                  throw Error(`HTTP ${response.status}, ${response.statusText}`);
              }
          })
          .then(res => {
              //console.log(res);
          }).catch(err => console.log(err));
      
          });
        } else {
          i = -2;
        }
      }).catch((err) => {
        console.log(err);
        i = -2;
      })
    }  
  }
  */

  handleLogout() {
    this.setState({ loggedIn: false });
  }
  handleLogin() {
    this.setState({ loggedIn: true });
    console.log(this.state.loggedIn + "LOGGEDIN APP.JA")
    this.setState(this.state);
  }
  render() {
    return (
      <div className="container">
        <Navbar className="navbar navbar-default" handleLogin={this.handleLogin} handleLogout={this.handleLogout} state={this.state.loggedIn}></Navbar>
        <hr />

        <Switch>
          <Route exact path='/' render={() => (<Home/>)} />
          <Route exact path='/about' render={() => (<About />)} />
          <Route exact path='/game' render={() => (<Game />)} />
          <Route exact path='/register' render={() => (<Register redirect={this.state.redirect}/>)} />
          <Route exact path='/loginOk' render={() => (<LoginOk />)} />
          <Route exact path='/wishlist' render={() => (<Whishlist loggedIn={this.state.loggedIn} />)} />
          <Route exact path='/game-detail/:id' render={(props) => (<GameDetail id={props.match.params.id} />)} />
        </Switch>
      </div>
    )
  }
}

//Navigation bar links
const Navbar = (props) => {

  return (
    <div>
      <NavBar handleLogin={props.handleLogin} state={props.state} handleLogout={props.handleLogout}></NavBar>
    </div>
  )
}

//About component
const About = () => {
  return (
    <div>
      <p>This website was created by Group 8</p>
    </div>
  )
}

//Login Component


//Login ok page
const LoginOk = () => {
  return (
    <div>

      <LoginUser></LoginUser>
    </div>
  )

}

//Game Component
const Game = () => {
  return (
    <div>
      <p>Game</p>
    </div>
  )
}

export default App;
