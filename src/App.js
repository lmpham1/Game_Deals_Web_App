import './App.css';
import React, { Component } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import GameSearch from './GameSearch';
import GameDetail from './GameDetail';

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
          <Route exact path='/game' render={() => (<GameSearch />)} />
          <Route exact path='/game-detail/:id' render={(props) => (<GameDetail id={props.match.params.id} />)} />
        </Switch>
      </div>
    )
  }
}

//Navigation bar links
const Navbar = () => {
  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Game Deals</a>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link to='/'>Home</Link>
          </li>
          <li class="nav-item">
            <Link to='/game'>Game</Link>
          </li>
          <li class="nav-item">
            <Link to='/game-detail'>Game-Detail</Link>
          </li>
          <li class="nav-item">
            <Link to='about'>About</Link>
          </li>
        </ul>
      </div>

      <div>
        <ul className="navbar-nav navbar-right">
          <li className="nav-item">
            <Link to='/login'>
              <button type="button" className="btn btn-success">Login</button>
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

    <div className="md-form active-purple active-purple-2 mb-3">
      <GameSearch></GameSearch>
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
export default App;
