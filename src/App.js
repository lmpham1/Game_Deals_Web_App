import './App.css';
import React, { Component, useState } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/global';
import { lightTheme, darkTheme } from './styles/theme';
import GameDetail from './GameDetail';
import LoginUser from './loginUser';
import NavBar from './navBar';
import Whishlist from './wishlist';
import Register from './Register';
import History from './history';
import Search from './Search';
import Home from './Home';
import ViewList from './viewList';
import Axios from 'axios';
import {toast} from 'react-toastify';
import About from './About'
import { light } from '@material-ui/core/styles/createPalette';


//Routing setup
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loggedIn: false,
      userId: "",
      theme: "light"
    };
    this.toggleTheme = this.toggleTheme.bind(this);
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
        this.setState({ userId: res.data._id });
        this.setState({ theme: res.data.theme})
      }
      else {
        this.setState({ loggedIn: false });
      }
    });
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

  toggleTheme() {
      if (this.state.theme == "light"){
        this.setState({ theme: "dark" }, () => {
          fetch(`http://localhost:8080/api/updateTheme/${this.state.userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme: this.state.theme})
          })
            .then(data => data.json())
        });
        console.log("Should be dark now: " + this.state.theme);
      }
      else {
        this.setState({ theme: "light"}, ()=> {
          fetch(`http://localhost:8080/api/updateTheme/${this.state.userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme: this.state.theme})
          })
            .then(data => data.json())
        })
        console.log("Should be light now: " + this.state.theme);
      }
  }


  handleLogout() {
    this.setState({ loggedIn: false });
    //window.location.reload(false);
  }
  handleLogin() {
    this.setState({ loggedIn: true });
    console.log(this.state.loggedIn + "LOGGEDIN APP.JS");
    this.setState(this.state);
    //window.location.reload(false);
    //toast.success("Welcome back, " + this.state.user.fName + "!");
  }
  
  render() {
    return (
      <ThemeProvider theme={this.state.theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles/>
        <div className="container">
          <NavBar className="navbar navbar-default" 
              handleLogin={this.handleLogin} 
              handleLogout={this.handleLogout} 
              state={this.state.loggedIn}
              theme={this.state.theme}  
              toggleTheme={this.toggleTheme}
          >
          </NavBar>
          <div className='custom-control custom-switch'>
            <input
              type='checkbox'
              className='custom-control-input'
              id='customSwitches'
              checked={this.state.theme == "dark" ? true : false}
              onChange={this.toggleTheme}
              data-size="large"
            />
            <label className='custom-control-label' htmlFor='customSwitches'>
              Dark Mode
            </label>
        
        </div>
          <hr />
          <Switch>
            <Route exact path='/' render={() => (<Home/>)} />
            <Route exact path='/search' render={() => (<Search/>)} />
            <Route exact path='/about' render={() => (<About />)} />
            <Route exact path='/history' render={() => (<History />)} />
            <Route exact path='/register' render={() => (<Register redirect={this.state.redirect}/>)} />
            <Route exact path='/loginOk' render={() => (<LoginOk />)} />
            <Route exact path='/wishlist' render={() => (<Whishlist loggedIn={this.state.loggedIn} />)} />
            <Route exact path='/viewList' render={() => (<ViewList />)} />
            <Route exact path='/game-detail/:id' render={(props) => (<GameDetail id={props.match.params.id} />)} />
          </Switch>
        </div>

      </ThemeProvider>
    )
  }
}

//About component


//Login ok page
const LoginOk = () => {
  return (
    <div>

      <LoginUser></LoginUser>
    </div>
  )

}

export default App;
