import './App.css';
import React, { Component } from 'react';
import { Route, Switch, Link } from "react-router-dom";

//Routing setup
class App extends Component {
  render() {
    return (
      <div className="container">
        <Navbar className="navbar navbar-default" />
        <hr />

        <h1>Find the best game deals</h1>

        <hr />

        <Switch>
          <Route exact path='/' render={() => (<Home />)} />
          <Route exact path='/about' render={() => (<About />)} />
          <Route exact path='/login' render={() => (<Login />)} />
          <Route exact path='/game' render={() => (<Game />)} />
        </Switch>
      </div>
    )
  }
}

//Navigation bar links
const Navbar = () => {
  return (

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">Game Deals</a>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <Link to='/'>Home</Link>
          </li>
          <li class="nav-item">
            <Link to='/game'>Game</Link>
          </li>
          <li class="nav-item">
            <Link to='about'>About</Link>
          </li>
        </ul>
      </div>

      <div>
        <ul class="navbar-nav navbar-right">
          <li class="nav-item">
            <Link to='/login'>
              <button type="button" class="btn btn-success">Login</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>

  )
}

//Home Component
const Home = () => {
  return (

    <div class="md-form active-purple active-purple-2 mb-3">
      <input class="form-control" type="text" placeholder="Search for a game title" aria-label="Search"/>
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
const Login = () => {
  return (
    <div>
      <p>Login Page</p>
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
