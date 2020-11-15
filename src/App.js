import './App.css';
import React, { Component, useState } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import GameSearch from './GameSearch';
import GameDetail from './GameDetail';
import LoginUser from './loginUser'
import NavBar from './navBar'
import Axios from "axios";

//Routing setup
class App extends Component {
  render() {
    return (
      <div className="container">
        <Navbar className="navbar navbar-default" />


        <Switch>
        <Route exact path='/' render={() => (<Home />)} />
          <Route exact path='/about' render={() => (<About />)} />
          <Route path='/login' render={(props) => (<Login {...props} />)} />
          <Route exact path='/game' render={() => (<Game />)} />
          <Route exact path='/loginOk' render={() => (<LoginOk />)} />
          <Route exact path='/game-detail/:id' render={(props) => (<GameDetail id={props.match.params.id} />)} />
        </Switch>
      </div>
    )
  }
}

//Navigation bar links
const Navbar = () => {
  return (
    <div>
      <NavBar></NavBar>
    </div>
    // <nav className="navbar navbar-expand-lg navbar-light bg-light">
    //   <a className="navbar-brand" href="/">Game Deals</a>

    //   <div className="collapse navbar-collapse" id="navbarNav">
    //     <ul className="navbar-nav">
    //       <li className="nav-item active">
    //         <Link to='/'>Home</Link>
    //       </li>
    //       <li class="nav-item">
    //         <Link to='/game-detail'>Game-Detail</Link>
    //       </li>
    //       <li class="nav-item">
    //         <Link to='about'>About</Link>
    //       </li>
    //     </ul>
    //   </div>

    //   <div>
    //     <ul className="navbar-nav navbar-right">
    //       <li className="nav-item">
    //         <Link to='/login'>
    //           <button type="button" className="btn btn-success">Login</button>
    //         </Link>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>

  )
}

//Home Component
const Home = () => {

  var gameName = "";
  return (
    
    <div className="md-form active-purple active-purple-2 mb-3">
      <br/>
      <h1>Game Deals</h1>
      <br/>
      <GameSearch></GameSearch>
    </div>

  )
}

//About component
const About = () => {
  return (
<div class="about-section">
  <h1>Created By</h1>
  <h5>Artur Pinheiro, Bennet Ngan, Kyle Alialy, Minh Pham</h5>
  <br/>
  <p>This is a webtool created for the purposes of searching for the cheapest current prices for digital games across multiple storefronts.</p>
  <p>Created by Gr</p>
</div>
  )
}

const Login = (props) => {
  console.log(props);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);
  const login = (props) => {

    Axios({
      method: "POST",
      data: {
        userName: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:8080/api/login",
    }).then((res) => {
      console.log(res.data)
      console.log(props)
      if (res.data.userName)
      {
        this.refresh(); 
        props.history.push("/LoginOk");
      }
      setData(res.data);

    });
  };

  return (
    <div>
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            placeholder="username" onChange={(e) => setLoginUsername(e.target.value)}></input>
        </div>

        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1"
            placeholder="password"
            onChange={(e) => setLoginPassword(e.target.value)}></input>
        </div>
      </form>
      <button onClick={() => login(props)} class="btn btn-primary">Submit</button>

      <div>
        {data}
      </div>
    </div>
  )
}

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
