import React, { Component } from "react";
import Axios from 'axios';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      date: null,
      commentInput: '',
      stores: [],
      comments: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ commentInput: e.target.value });
  }

  handleSubmit(e) {
    const forceUpdate = () => {
      this.setState(this.state);
      this.forceUpdate();
    }

    const addRow = (obj) => {
      this.state.comments.comments.push(obj);
      forceUpdate();
      this.setState({commentInput: ''});
    }
    e.preventDefault();
    if (this.state.commentInput.length === 0) {
      return;
    }

    const commentObj = {
      comment: this.state.commentInput,
      date: new Date(),
      userId: this.state.userId._id,
      userName: this.state.userId.userName,
      userFName: this.state.userId.fName,
      userLName: this.state.userId.lName
    }

    fetch(`http://localhost:8080/api/addComment/${this.state.comments._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentObj)
    })
    .then(async data => await data.json())
    .then(obj => addRow(obj))
  }

  componentWillReceiveProps(nextProps) {
    //this.setState({ loggedIn: nextProps.loggedIn });  
    //this.setState({ userId: nextProps.user})
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
        this.setState({date: new Date()});
      }
      else {
        this.setState({ loggedIn: false });
      }
      console.log(res.data);
      console.log("loggedIn STATE>>>>>    " + this.state.loggedIn);
    });

    let hasSteamID = false;
    fetch(`http://localhost:8080/api/game/${this.props.id}`)
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
          comments: json["0"]
        })
        if (this.state.loggedIn) {
          var userId = this.state.userId._id;
          var c = this.state.comments;
          for (let i = 0; i < c.comments.length; i++) {
            let likeBtn = document.getElementById(`like${i}`);
            console.log("HERE")
            for (let j = 0; j < c.comments[i].userLikes.length; j++) {
              if (userId == c.comments[i].userLikes[j]) {
                likeBtn.classList.add("btnColour");
              }
            }
          }
          
          for (let i = 0; i < c.comments.length; i++) {
            let dislikeBtn = document.getElementById(`dislike${i}`);
            for (let j = 0; j < c.comments[i].userDislikes.length; j++) {
              if (userId == c.comments[i].userDislikes[j]) {
                dislikeBtn.classList.add("btnColour");
              }
            }
          }
        }

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
    const forceUpdate = () => {
      this.setState(this.state);
      this.forceUpdate();
    }
    console.log(this.state);
    var { isLoaded, items } = this.state;
    if (!isLoaded) {
      return (
        <div>
          <div class="d-flex justify-content-center">
              <h4>Loading...</h4>
          </div>
          <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
              </div>
          </div>
        </div>
      );
    }
    else {
      document.title = items.info.title;
      //          <span class="badge badge-danger">X</span>
      //console.log(this.state.comments);
      if (this.state.userId != null) {
        this.state.gameInformation["date"] = new Date();
        this.state.gameInformation["thumb"] = this.state.thumbnail;
        fetch(`http://localhost:8080/api/history/push/${this.state.userId._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.gameInformation)
        })
          .then(data => data.json())
          .then(res => console.log(res));
        }
        
        if (this.state.userId != null) {
          console.log(this.state.userId);
          let len = `(${this.state.comments.comments.length})`;
          //<span class = "float-right"><SortComments forceUpdate = {forceUpdate} comments = {this.state.comments.comments} /></span>
          return (
            <div>
            <DisplayInfo userId={this.state.userId} gameInfo={this.state.gameInformation} cheapestDealEmpty={this.state.cheapestDealEmpty} items={this.state.items} thumbnail={this.state.thumbnail} />
            <hr class="line"></hr>
            <hr class="line"></hr>
            <DisplayGameInfoTable items={this.state.items} stores={this.state.stores} />
            <h3><strong>Comments {this.state.comments.comments.length > 0 && (len)}</strong></h3>
            <form onSubmit = {this.handleSubmit}>
              <div class="form-group">
                <textarea 
                  value = {this.state.commentInput} 
                  onChange={this.handleChange} 
                  placeholder="Add a public comment..." 
                  class="form-control" 
                  rows="2"
                  maxLength = "280"
                  />
                <p class = "pull-right"><strong>Word Count:</strong> {this.state.commentInput.length}/280</p>
                <div class = "submitForm">
                <button disabled={this.state.commentInput == ''} class="btn btn-primary btn-lg" id = "submitBtn" role="button">Submit</button>
                </div>
              </div>
            </form>
            <DisplayComments userId = {this.state.userId._id} forceUpdate = {forceUpdate} gameId = {this.state.comments._id} comments={this.state.comments.comments}/>
          </div>
        );
      }
      //<button onClick = {"this.setState({commentInput: ''});"} class="btn btn-secondary btn-lg">Cancel</button>
      else {
        console.log(items);
        return (
          <div>
            <DisplayInfo userId={this.state.userId} gameInfo={this.state.gameInformation} cheapestDealEmpty={this.state.cheapestDealEmpty} items={this.state.items} thumbnail={this.state.thumbnail} />
            <hr class="line"></hr>
            <hr class="line"></hr>
            <DisplayGameInfoTable items={this.state.items} stores={this.state.stores} />
            <h3><strong>Comments</strong></h3>
            <div>
              <h5><i>Log in to comment</i></h5>
            </div>
            <DisplayComments forceUpdate = {forceUpdate} gameId = {this.state.comments._id} comments={this.state.comments.comments}/>
          </div>
        );
      
      }
    }
  }
}

const SortComments = (props) => {

  const sortComment = (forceUpdate, comments, type) => {
    function newest(a,b) {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      return 0;
    }
    function oldest(a,b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    }
    function topLikes(a,b) {
      if (a.upVote > b.upVote) {
        return -1;
      }
      if (a.upVote < b.upVote) {
        return 1;
      }
      return 0;
    }

    if (type == "topLikes") comments.sort(topLikes);
    else if (type == "newest") comments.sort(newest);
    else if (type == "oldest") comments.sort(oldest);
    forceUpdate();
  }
  return (
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Sort by
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item" onClick={() => sortComment(props.forceUpdate, props.comments, "topLikes")}>Most Likes</a>
      <a class="dropdown-item" onClick={() => sortComment(props.forceUpdate, props.comments, "newest")}>Newest</a>
      <a class="dropdown-item" onClick={() => sortComment(props.forceUpdate, props.comments, "oldest")}>Oldest</a>
    </div>
  </div>
  )
}
const DisplayComments = (props) => {
  const removeRow = (idx, arr, forceUpdate) => {
    let removedComment = arr.splice(idx, 1);
    forceUpdate();
  }

  const removeComment = (gameId, commentId, idx, arr, forceUpdate) => {
    fetch(`http://localhost:8080/api/removeComment/${gameId}/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(async data => await data.json())
    .then(obj => removeRow(idx, arr, forceUpdate))
  }

  const rows = props.comments.map((item, index) => {
    return (
      <SingleCommentView userId = {props.userId} forceUpdate = {props.forceUpdate} comments = {props.comments} gameId = {props.gameId} removeComment = {removeComment} item = {item} index = {index}/>
    )
  })
  return (
    <div class="container">
      <div class="row" id = "commentsRow">
        <div class="col">
          {rows}
        </div>
      </div>
    </div>
  );
}

const SingleCommentView = (props) => {
  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')
  const date = new Date(props.item.date)
  return (
    <div class = "media g-mb-30 media-comment">
      <img
        class="d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15"
        src="https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/263F418F2C47943D98B2877ECAD174927FBBD359C4AFB45BE0C6A22AD589D22E/scale?width=300&aspectRatio=1&format=png"
        alt="Image Description"
      />
      <div class="comment-theme media-body u-shadow-v18 g-bg-secondary g-pa-30">
        <div class="g-mb-15">
          <h5 class="h5 g-color-gray-dark-v1 mb-0">{props.item.userFName} {props.item.userLName}</h5>
          <span class="g-color-gray-dark-v4 g-font-size-12">{timeAgo.format(date)}</span>
        </div>
        <p id = "commentTxt">{props.item.comment}</p>
        <ul class="list-inline d-sm-flex my-0">
          <LikeButton props = {props.item} index = {props.index} gameId = {props.gameId} userId = {props.userId} forceUpdate = {props.forceUpdate} />
          {props.userId == props.item.userId && <li class="list-inline-item ml-auto">
            <a onClick={() => props.removeComment(props.gameId, props.item._id, props.index, props.comments, props.forceUpdate)} role="button" class="text-muted">Remove</a>
          </li>}
        </ul>
      </div>
    </div>
  );
}

const LikeButton = (props) => {
  const updateLikeState = (type, item, userId, forceUpdate, index) => {
    if (type == true) {
      item.userLikes.push(userId);
      ++item.upVote;
      forceUpdate();
    }
    else {
      item.userLikes.splice(index, 1);
      if (item.upVote <= 0) {
        item.upVote = 0;
      }
      else {
        --item.upVote;
      }
      forceUpdate();
    }
  }

  const updateDislikeState = (type, item, userId, forceUpdate, index) => {
    if (type == true) {
      item.userDislikes.push(userId);
      ++item.downVote;
      forceUpdate();
    }
    else {
      item.userDislikes.splice(index, 1);
      if (item.downVote <= 0) {
        item.downVote = 0;
      }
      else {
        --item.downVote;
      }      
      forceUpdate();
    }
  }
  const likeAPI = (comment, gameId, userId, forceUpdate, index) => {
    fetch(`http://localhost:8080/api/likeComment?commentId=${comment._id}&gameId=${gameId}&userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    })
      .then(data => data.json())
      .then(res => {
        if (!res.message) {
          updateLikeState(true, comment, userId, forceUpdate, index)
        }
      });
  }

  const unlikeAPI = (comment, gameId, userId, forceUpdate, index) => {
    fetch(`http://localhost:8080/api/unLikeComment?commentId=${comment._id}&gameId=${gameId}&userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    })
      .then(data => data.json())
      .then(res => {
        if (!res.message) {
          updateLikeState(false, comment, userId, forceUpdate, index)
        }
      });
  }

  const dislikeAPI = (comment, gameId, userId, forceUpdate, index) => {
    fetch(`http://localhost:8080/api/dislikeComment?commentId=${comment._id}&gameId=${gameId}&userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    })
      .then(data => data.json())
      .then(res => {
        if (!res.message) {
          updateDislikeState(true, comment, userId, forceUpdate, index)
        }
      });
  }

  const unDislikeAPI = (comment, gameId, userId, forceUpdate, index) => {
    fetch(`http://localhost:8080/api/unDislikeComment?commentId=${comment._id}&gameId=${gameId}&userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    })
      .then(data => data.json())
      .then(res => {
        if (!res.message) {
          updateDislikeState(false, comment, userId, forceUpdate, index)
        }
      });
  }

  
  const like = (index, comment, gameId, userId, forceUpdate) => {
    if (userId == null) {
      const notifyRemoved = () => {
        toast.error(`Please login to like/dislike a comment`);
      }
      notifyRemoved();
    }
    else {
      let likeBtn = document.getElementById(`like${index}`);
      let dislikeBtn = document.getElementById(`dislike${index}`);
  
      //if liked / unlike
      if (likeBtn.classList.contains("btnColour")) {
        unlikeAPI(comment, gameId, userId, forceUpdate, index);
        likeBtn.classList.remove("btnColour");
      }
      else {
        if (dislikeBtn.classList.contains("btnColour")) {
          unDislikeAPI(comment, gameId, userId, forceUpdate, index);
          dislikeBtn.classList.remove("btnColour");
        }
        likeAPI(comment, gameId, userId, forceUpdate, index);
        likeBtn.classList.add("btnColour");
      }
    }
  }

  const dislike = (index, comment, gameId, userId, forceUpdate) => {
    if (userId == null) {
      const notifyRemoved = () => {
        toast.error(`Please login to like/dislike a comment`);
      }
      notifyRemoved();
    }
    else {
      let likeBtn = document.getElementById(`like${index}`);
      let dislikeBtn = document.getElementById(`dislike${index}`);
  
      if (dislikeBtn.classList.contains("btnColour")) {
        unDislikeAPI(comment, gameId, userId, forceUpdate, index);
        dislikeBtn.classList.remove("btnColour");
      }
      else {
        if (likeBtn.classList.contains("btnColour")) {
          unlikeAPI(comment, gameId, userId, forceUpdate, index);
          likeBtn.classList.remove("btnColour");
        }
        dislikeAPI(comment, gameId, userId, forceUpdate, index);
        dislikeBtn.classList.add("btnColour");
      }
    }
  }

  let likeStr = `like${props.index}`;
  let dislikeStr = `dislike${props.index}`;
  return (
    <div>
      <li class="list-inline-item g-mr-20">
        <a onClick={() => like(props.index, props.props, props.gameId, props.userId, props.forceUpdate)} id = "likeColour" class="u-link-v5 g-color-gray-dark-v4 g-color-primary--hover">
          <i id = {likeStr} class="fa fa-thumbs-up g-pos-rel g-top-1 g-mr-3">{props.props.upVote}</i>
        </a>
      </li>
      <li class="list-inline-item g-mr-20">
        <a onClick={() => dislike(props.index, props.props, props.gameId, props.userId, props.forceUpdate)}id = "likeColour" class="u-link-v5 g-color-gray-dark-v4 g-color-primary--hover">
          <i id = {dislikeStr}  class="fa fa-thumbs-down g-pos-rel g-top-1 g-mr-3">{props.props.downVote}</i>
        </a>
      </li>
    </div>
  )
}

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
          <h3><strong>{props.items.info.title}</strong></h3>
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
            <h3><strong>{props.items.info.title}</strong> <span data-toggle="tooltop" data-placement="right" title="Add game to wishlist"> <i value={props.gameInfo} onClick={() => AddRemoveGame(props.gameInfo, props.userId)} class="fa fa-heart-o" id="heart" aria-hidden="true"></i> </span></h3>
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
  var heart = document.getElementById("heart");

  const notifyAdd = () => {
    toast.success(`Game has been added to your wishlist.`);
  }
  const notifyRemoved = () => {
    toast.error(`Game has been removed from your wishlist.`);
  }
  const errorToast = () => {
    toast.error(`Please login to add game to wishlist`);
  }
  if (userId == null) {
    errorToast();
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
        notifyRemoved();
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
        notifyAdd();
      
    }

  }

}

const DisplayGameInfoTable = (props) => {
  return (
    <div>
      <h3><strong>Current Deals</strong></h3>
      <table id="dealsTable" class="table table-hover table-dark ">
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