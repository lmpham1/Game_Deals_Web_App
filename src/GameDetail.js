import React, { Component } from "react";
import Axios from 'axios';
import './App.css';

class GameDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      items: {},
      isLoaded: false,
      isEmpty: true,
      thumbnail: null,
      cheapestDealID: null,
      userId: null,
      loggedIn: false,
      gameInformation: {},
      cheapestDealEmpty: false,
      stores: []
    }
  }

  componentDidMount() {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8080/user",
    }).then((res) => {
      if (res.data._id) {
        this.setState({ loggedIn: true });
        this.setState({ userId: res.data });
      }
      else {
        this.setState({ loggedIn: false });
      }
      console.log(res.data);
      console.log("loggedIn STATE>>>>>    " + this.state.loggedIn);
    });

    let hasSteamID = false;
    fetch(`https://agile-sands-96303.herokuapp.com/api/game/${this.props.id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else if (res.status === 404) {
          throw Error("HTTP 404, Not Found");
        }
        else {
          throw Error(`HTTP ${res.status}, ${res.statusText}`);
        }
      })
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json,
          isEmpty: false,
        })
        if (json.info.steamAppID != null) {
          hasSteamID = true;
          this.setState({ thumbnail: `https://steamcdn-a.akamaihd.net/steam/apps/${json.info.steamAppID}/header.jpg?t=1602601042` })
        }
        fetch(`https://agile-sands-96303.herokuapp.com/api/search/${json.info.title}`) // fetch info w deals
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            else if (res.status === 404) {
              throw Error("HTTP 404, Not Found");
            }
            else {
              throw Error(`HTTP ${res.status}, ${res.statusText}`);
            }
          })
          .then(json => {
            for (let i = 0; i < json.length; i++) {
              if (this.props.id == json[i].gameID) {
                if (!hasSteamID) {
                  this.setState({
                    thumbnail: json[i].thumb,
                    cheapestDealID: json[i].cheapestDealID
                  })
                }
                else {
                  this.setState({
                    cheapestDealID: json[i].cheapestDealID
                  })
                }

                fetch(`https://agile-sands-96303.herokuapp.com/api/deal/${json[i].cheapestDealID}`) // fetch data with game information 
                  .then(res => {
                    if (res.ok) {
                      return res.json();
                    }
                    else if (res.status === 404) {
                      throw Error("HTTP 404, Not Found");
                    }
                    else {
                      throw Error(`HTTP ${res.status}, ${res.statusText}`);
                    }
                  })
                  .then(json => {
                    if (json.length === 0) {
                      this.setState({ cheapestDealEmpty: true })
                    }
                    else {
                      this.setState({ gameInformation: json.gameInfo })
                      if(this.state.gameInformation){

                        var heart = document.getElementById("heart");
                        let hasGame = false;
                        for(let i = 0; i < this.state.userId.wishlistedGames.length; ++i){
                          if(this.state.userId.wishlistedGames[i].gameID == this.state.gameInformation.gameID){
                            hasGame = true;
                          }
                        }
                        if(hasGame){
                          heart.classList.remove("fa-heart-o");
                          heart.classList.add("fa-heart");
                        }
                      }
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  })
              }
              break;
            }

          })
          .catch(error => {
            console.log(error);
          })

      })
      .catch(error => {
        console.log(error);
      })

    fetch(`https://agile-sands-96303.herokuapp.com/api/stores`) // fetch game stores
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else if (res.status === 404) {
          throw Error("HTTP 404, Not Found");
        }
        else {
          throw Error(`HTTP ${res.status}, ${res.statusText}`);
        }
      })
      .then(json => {
        this.setState({ stores: json })
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    
    var { isLoaded, items } = this.state;
    if (!isLoaded) {
      return (
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    else {
      document.title = items.info.title;
      return (
        <div>
          <DisplayInfo userId={this.state.userId} gameInfo={this.state.gameInformation} cheapestDealEmpty={this.state.cheapestDealEmpty} items={this.state.items} thumbnail={this.state.thumbnail} />
          <hr class="line"></hr>
          <hr class="line"></hr>
          <DisplayGameInfoTable items={this.state.items} stores={this.state.stores} />
        </div>
      );
    }
  }
}
// <DisplayGameInfoTable items = {this.state.items} stores = {this.state.stores} />
const DisplayInfo = (props) => {
  let gameInfo = props.gameInfo
  console.log(props.gameInfo);
  let items = props.items;
  var months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"];
  let dateForCheapestPrice = new Date(items.cheapestPriceEver.date * 1000)
  dateForCheapestPrice = `${months[dateForCheapestPrice.getMonth()]} 
  ${dateForCheapestPrice.getDate()}, ${dateForCheapestPrice.getFullYear()}`

  let releaseDate = new Date(gameInfo.releaseDate * 1000)
  releaseDate = `${months[releaseDate.getMonth()]} 
  ${releaseDate.getDate()}, ${releaseDate.getFullYear()}`
  //<span id = "heart"><i id = "wishlist" class="fa fa-heart-o" aria-hidden="true" ></i> </span>
  if (props.cheapestDealEmpty) {
    return (
      <div class="card">
        <img class="card-img-top banner" src={props.thumbnail} alt="Responsive image"></img>
        <div class="card-body">
          <h3>{props.items.info.title}</h3>
        </div>
      </div>
    )
  }
  else {
    // <span data-toggle = "tooltop" data-placement="right" title="Email notificatio"> <i value={props.gameInfo} onClick={() => Notifs(props.gameInfo)} id = "bell" class="fa fa-bell-slash" aria-hidden="true"></i> </span>
    console.log("aaaaaaaaa")
    console.log(props.gameInfo)
    return (
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <img class="card-img-top banner" src={props.thumbnail} alt="Responsive image"></img>
            <div class="card-body">
              <h3>{props.items.info.title} <span data-toggle="tooltop" data-placement="right" title="Add game to wishlist"> <i value={props.gameInfo} onClick={() => AddRemoveGame(props.gameInfo, props.userId)} class="fa fa-heart-o" id="heart" aria-hidden="true"></i> </span></h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <table class="table">
            <tbody>
              <tr class="thead-dark">
                <th class="justify-content-between" colspan="3">
                  <h6><b>Game Information</b></h6>
                </th>
              </tr>
              <tr>
                <td>
                  <b>Retail Price:</b> ${gameInfo.retailPrice}
                </td>
              </tr>
              {items.cheapestPriceEver.date > "0" && <tr>
                <td>
                  <b>Cheapest Price:</b> ${items.cheapestPriceEver.price} on {dateForCheapestPrice}
                </td>
              </tr>}
              {gameInfo.releaseDate != "0" && <tr>
                <td>
                  <b>Release Date:</b> {releaseDate}
                </td>
              </tr>}
              {(gameInfo.steamAppID != null && gameInfo.steamRatingPercent !== '0') &&
                <tr>
                  <td>
                    <b>Steam Rating:</b> {gameInfo.steamRatingText} - {gameInfo.steamRatingPercent}% out of {gameInfo.steamRatingCount} reviews
                </td>
                </tr>}
              {(gameInfo.metacriticScore != '0') &&
                <tr>
                  <td>
                    <b>Metacritic Score:</b> {gameInfo.metacriticScore} out of 100
                </td>
                </tr>}
              {(gameInfo.steamAppID != null || gameInfo.metacriticLink != null) &&
                <tr>
                  <td>
                    <div class="review">
                      <b>Links:</b>
                      <hr></hr>
                      <div class="btn-group" role="group" aria-label="Basic example">
                        {gameInfo.steamAppID != null &&
                          <a href={`https://store.steampowered.com/app/${gameInfo.steamAppID}/${gameInfo.name}}/`} type="button" id="btnn" class="btn btn-primary"><b>Steam</b></a>}
                        {gameInfo.metacriticLink != null &&
                          <a href={`https://www.metacritic.com${gameInfo.metacriticLink}`} type="button" id="btnn" class="btn btn-warning"><b>Metacritic</b></a>}
                      </div>
                    </div>
                  </td>
                </tr>}

            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const AddRemoveGame = (props, userId) => {
  console.log("INSIDE ADDREMOVEGAME ELSE" + userId)
  var heart = document.getElementById("heart");
  if (userId == "") {

  }
  else {
    if (heart.classList.contains("fa-heart")) { // filled
      heart.classList.remove("fa-heart");
      heart.classList.add("fa-heart-o")
      fetch(`http://localhost:8080/api/removeGame/${userId._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
      })
        .then(data => data.json())
        .then(res => console.log(res));
    }
    else {
      heart.classList.remove("fa-heart-o");
      heart.classList.add("fa-heart")
      fetch(`http://localhost:8080/api/addGame/${userId._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
      })
        .then(data => data.json())
        .then(res => console.log(res));
    }

  }

}

const Notifs = (props) => {
  var bell = document.getElementById("bell");
  console.log(bell)
  if (bell.classList.contains("fa-bell")) { // filled
    bell.classList.remove("fa-bell");
    bell.classList.add("fa-bell-slash")
    /*
    fetch(`http://localhost:8080/api/removeGame/5f72836f83d8583460acb574`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(props)
  })
  .then(data => data.json())
  .then(res => console.log(res));*/
  }
  else {
    bell.classList.remove("fa-bell-slash");
    bell.classList.add("fa-bell");
    /*
    fetch(`http://localhost:8080/api/addGame/5f72836f83d8583460acb574`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    })
    .then(data => data.json())
    .then(res => console.log(res));*/
  }

}
const DisplayGameInfoTable = (props) => {
  return (
    <div>
      <h3>Current Deals:</h3>
      <table id="dealsTable" class="table table-hover table-dark">
        <TableHeader />
        <TableBody deals={props.items.deals} stores={props.stores} />
      </table>
    </div>
  )
}

const TableHeader = () => {
  return (
    <thead>
      <tr class="thead-dark">
        <th>Store</th>
        <th>Price</th>
        <th>Savings</th>
        <th>Link</th>
      </tr>
    </thead>
  )
}

const TableBody = (props) => {
  var store;
  console.log(props)
  const rows = props.deals.map((deal, index) => {
    for (let i = 0; i < props.stores.length; i++) {
      if (deal.storeID === props.stores[i].storeID) {
        store = props.stores[i];
        return <TableRow stores={store} key={index} deal={deal} />
      }
    }
  })
  return (
    <tbody>
      {rows}
    </tbody>
  )
}

const TableRow = (props) => {
  var deal = props.deal;
  let flag = false;
  var savings = 0;
  if (deal) {
    flag = true;
    savings = Number(deal.savings).toFixed(2);
  }
  let url = "https://www.cheapshark.com";
  if (flag) {
    var img = `${url}${props.stores.images.banner}`;
    return (
      <tr>
        <td><img class="storeImg" src={img} alt="Responsive image" /></td>
        <td>${deal.price}</td>
        <td>{savings}%</td>
        <td><a id="badge" class="badge badge-info" href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}>{props.stores.storeName}</a></td>
      </tr>
    )
  }
}
export default GameDetail;