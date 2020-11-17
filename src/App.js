import './App.css';
import React, { Component } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import GameSearch from './GameSearch';

//Routing setup
class App extends Component {
  render() {
    return (
      <div className="container">
        <Navbar className="navbar navbar-default" />


        <Switch>
          <Route exact path='/' render={() => (<Home />)} />
          <Route exact path='/about' render={() => (<About />)} />
          <Route exact path='/login' render={() => (<Login />)} />
          <Route exact path='/game-detail' render={() => (<GameDetail />)} />
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

//Login Component
const Login = () => {
  return (
    <div>
      <p>Login Page</p>
    </div>
  )
}

//Game-Detail Component
const GameDetail = () => {
  return (
    <div>
      <div class = "row">
        <div class = "col-md-8">
          <div class = "card">
            <img class = "card-img-top" src = "https://steamcdn-a.akamaihd.net/steam/apps/812140/header.jpg?t=1602601042"></img>
              <div class = "card-body">
                <h3>Assassin's Creed: Odyssey</h3>
              </div>
          </div>
        </div>
        <div class = "col-md-4">
          <table class = "table">
            <tbody>
              <tr class = "thead-dark">
                <th class = "justify-content-between" colspan = "3">
                  <h6>Game Information</h6>
                </th>
              </tr>
              <tr>
                <td>
                  <b>Retail Price:</b> $59.99 USD
                </td>
              </tr>
              <tr>
                <td>
                  <b>Cheapest Price:</b> $15.12 USD on May 10, 2020
                </td>
              </tr>
              <tr>
                <td>
                  <b>Release Date:</b> October 5, 2018
                </td>
              </tr>
              <tr>
                <td>
                  <b>Steam Rating:</b> Very Positive - 88% out of 70,041 reviews
                </td>
              </tr>
              <tr>
                <td>
                  <b>Metacritic Score:</b> 86 out of 100
                </td>
              </tr>
              <tr>
                <td>
                  <div class = "review">
                    <b>Links:</b>
                    <hr></hr>
                    <div class = "btn-group" role = "group" aria-label = "Basic example">
                      <a href = "https://store.steampowered.com/app/812140/Assassins_Creed_Odyssey/" type="button" id = "btnn" class="btn btn-primary"><b>Steam</b></a>
                      <a href = "https://www.metacritic.com/game/pc/assassins-creed-odyssey" type="button" id = "btnn" class="btn btn-warning"><b>Metacritic</b></a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <hr class = "line"></hr>
      <hr class = "line"></hr>
      <div>
        <h3>List of deals:</h3>
        <table id = "dealsTable" class = "table table-hover table-dark">
          <thead>
            <tr class = "thead-dark">
              <th>Store</th>
              <th>Price</th>
              <th>Savings</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/22.png"></img></td>
              <td>$15.64 USD</td>
              <td>73.91%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=eI%2F3OmSiiUMlIkFkTLSLPMpWjW8My0inqUFM4JkcecM%3D">GameBillet</a></td>
            </tr>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/14.png"></img></td>
              <td>$16.79 USD</td>
              <td>72.01%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=eI%2F3OmSiiUMlIkFkTLSLPMpWjW8My0inqUFM4JkcecM%3D">Fanatical</a></td>
            </tr>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/10.png"></img></td>
              <td>$17.99 USD</td>
              <td>70.01%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=Dgqeipmlyuhn%2BTavZlErHs%2FIplPEb3wGaLAOX7nre8k%3D">Humble Store</a></td>
            </tr>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/0.png"></img></td>
              <td>$17.99 USD</td>
              <td>70.01%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=ELkqXEh9wV57QTgQ0yCCjEXFDTbrWV%2Fljw8aMEd1vqI%3D">Steam</a></td>
            </tr>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/12.png"></img></td>
              <td>$18.00 USD</td>
              <td>69.99%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=nRqb82mrV2qOA7q%2Bk7tpXhv6bY0gPNVgbVL%2BXJEVxPU%3D">Uplay</a></td>
            </tr>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/26.png"></img></td>
              <td>$53.99 USD</td>
              <td>10.00%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=euR5M27vzPFgHwXpUDq1%2BIbWE6GpS0N3WlUYavaUezs%3D">GamesPlanet</a></td>
            </tr>
            <tr>
              <td><img class = "storeImg" src = "https://www.cheapshark.com/img/stores/banners/1.png"></img></td>
              <td>$53.99 USD</td>
              <td>10.00%</td>
              <td><a id = "badge" class = "badge badge-info"href = "https://www.cheapshark.com/redirect?dealID=gqBqWb5QhkOl6PJ9l9TU45Tda03sp8jB9k5RNgiUQRE%3D">GamersGate</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App;
