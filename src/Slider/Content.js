import React, {useState} from 'react';
import IconCross from './../Icons/IconCross';
import {Link} from 'react-router-dom';
import './Content.scss';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const Content = ({ movie, onClose, onAddGame, onRemoveGame, user, loggedIn }) => {
  const [gameInfo, setGameInfo] = useState(null);
  fetch("https://www.cheapshark.com/api/1.0/deals?id=" + movie.dealID).then(response => {
    if (response.ok){
        return response.json();
    }
    else if (response.status === 404){
        throw Error("HTTP 404, Not Found");
    } else {
        throw Error(`HTTP ${response.status}, ${response.statusText}`);
    }
  }).then(responseData => {
    if(responseData){
      setGameInfo(responseData.gameInfo);
    }
  }).catch(error => console.log(error)).catch(error => console.log(error));
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Wanna follow this game?</Popover.Title>
      <Popover.Content>
        <a href="#exampleInputEmail1">Log in</a> or <Link to='register'>create an account</Link> now to receive price alert
      </Popover.Content>
    </Popover>
  );
  
  let isInWishlist = false;
  if (user) {
    for(let i = 0; i < user.wishlistedGames.length; ++i){
      if (movie.gameID === user.wishlistedGames[i].gameID){
        isInWishlist = true;
        break;
      }
    }
  }
  return(
  <div className="content">
    <div className="content__background">
      <div className="content__background__shadow" />
      <div
        className="content__background__image"
        style={{ 'background-image': `url(${movie.thumb})` }}
      />
    </div>
    <div className="content__area">
      <div className="content__area__container">
        <div className="content__title">{movie.title}</div>
        <div className="content__description">
          <div className="row">
            <s style={{fontSize:25}}>{movie.normalPrice}$</s>&nbsp;<p className="badge badge-dark" style={{fontSize: 30}}>{movie.salePrice}$ (-{Math.floor(movie.savings)}%)</p>
          </div>
          <div className="row">
            <Link className="btn btn-primary col-6 mt-3" to={"game-detail/" + movie.gameID}>See Details</Link>
          </div>
          <div className="row">
            {(!loggedIn || !user) &&
              <OverlayTrigger trigger="click" placement="right" overlay={popover} delay={{ show: "250", hide: "400" }}>
                <a className="btn btn-info col-6 mt-3">Add To Wishlist</a>
              </OverlayTrigger>}
            {(loggedIn && user && !isInWishlist) &&
              <a class="btn btn-info col-6 mt-3" id={"heart"+ movie.gameID} onClick={() => onAddGame(gameInfo)}>Add To Wishlist</a>}
            {(loggedIn && user && isInWishlist) &&
              <a class="btn btn-danger col-6 mt-3" id={"heart"+ movie.gameID} onClick={() => onRemoveGame(gameInfo)}>Remove From Wishlist</a>}
          </div>
          <div className="row">
            <a className="btn btn-light col-6 mt-3" href={"https://www.cheapshark.com/redirect?dealID=" + movie.dealID}>Go To Store Page <i className="fa fa-external-link"></i></a>
          </div>
        </div>
      </div>
      <button className="content__close" onClick={onClose}>
        <IconCross />
      </button>
    </div>
  </div>
)};

export default Content;
