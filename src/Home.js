import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import './App.css';
import Axios from 'axios';
import Slider from './Slider';


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,

            storeGamesURL: "https://www.cheapshark.com/api/1.0/deals?storeID=",
            storeGamesAll: [],
            storeArr: [],
            trendingGames: [],

            loggedIn: false,
            user: null
        }

        this.handleAddGameToWishList = this.handleAddGameToWishList.bind(this);
        this.handleRemoveGameFromWishlist = this.handleRemoveGameFromWishlist.bind(this);
    }

    handleAddGameToWishList(gameInfo) {

    }

    handleRemoveGameFromWishlist(gameInfo){

    }

    componentDidMount() {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/user",
          }).then((res) => {
            if (res.data._id) {
              this.setState({ loggedIn: true });
              this.setState({ user: res.data });
            }
            else {
              this.setState({ loggedIn: false });
            }
        });

        fetch('http://localhost:8080/api/db/viewedRecentGames').then(response => {
            if (response.ok){
                return response.json();
            }
            else if (response.status === 404){
                throw Error("HTTP 404, Not Found");
            } else {
                throw Error(`HTTP ${response.status}, ${response.statusText}`);
            }
        }).then(responseData => {
            if (responseData){
                responseData.map((game, index) => {
                    fetch(`https://www.cheapshark.com/api/1.0/games?id=${game.gameId}`).then(response => {
                        if (response.ok){
                            return response.json();
                        }
                        else if (response.status === 404){
                            throw Error("HTTP 404, Not Found");
                        } else {
                            throw Error(`HTTP ${response.status}, ${response.statusText}`);
                        }
                    }).then(responseData => {
                        
                        if (responseData){
                            responseData.gameId = game.gameId;
                            /*
                            if (this.state.trendingGames.length < 5){
                                this.setState({
                                    trendingGames: this.state.trendingGames.concat(responseData)
                                })
                            } else {
                                for(let i = 0; i < 5; ++i){
                                    if (responseData.deals[0].savings > this.state.trendingGames[i].deals[0].savings){
                                        this.setState({
                                            trendingGames: this.state.trendingGames.filter((g, index) => {return index !== i}).concat(responseData)
                                        })
                                        break;
                                    }
                                }
                            }
                            */
                            this.setState({
                                trendingGames: this.state.trendingGames.concat(responseData).sort((a, b) => { return a.deals[0].savings > b.deals[0].savings }).slice(0,5)
                            })
                        }
                        //console.log(this.state.trendingGames);
                    }).catch(error => console.log(error)).catch(error => console.log(error))
                })
            }
            else throw {error: "No games found!"}
        }).catch(error => console.log(error)).catch(error => console.log(error));

        fetch("https://www.cheapshark.com/api/1.0/stores").then(response => {
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
                this.setState({ storeArr: responseData})
                responseData.map((store, index) => {
                    fetch(this.state.storeGamesURL + store.storeID).then(response => {
                        if (response.ok){
                            return response.json();
                        }
                        else if (response.status === 404){
                            throw Error("HTTP 404, Not Found");
                        } else {
                            throw Error(`HTTP ${response.status}, ${response.statusText}`);
                        }
                    }).then(responseData => {
                        if(responseData && responseData.length > 0){
                            this.setState(state => {
                                const deals2D = state.storeGamesAll;
                                deals2D.push(responseData.filter((deal, idx) => {return deal.savings > 10;}));
                                return({storeGamesAll: deals2D});
                            })
                        }
                        //console.log(this.state.storeGamesAll);
                    }).catch(error => console.log(error)).catch(error => console.log(error));
                })
            }
        }).catch(error => console.log(error)).catch(error => console.log(error));

        console.log(this.props.location.state);
        if (this.props.location.state !== undefined){
            this.setState({redirect: this.props.location.state.redirect});
        }
    }

    render() {
        
        
        return (
            <div>
                <h2 className="text-center badge-light mb-0 p-2" style={{fontFamily: 'Russo One', sanSerifs: true}}><img width="20" src="https://www.flaticon.com/svg/vstatic/svg/599/599502.svg?token=exp=1615440501~hmac=f87a3e473c115cff970de6d7b07e1f97"/> Featured Titles <img width="20" src="https://www.flaticon.com/svg/vstatic/svg/599/599502.svg?token=exp=1615440501~hmac=f87a3e473c115cff970de6d7b07e1f97"/></h2>
                {this.state.trendingGames && 
                <Carousel  className="img-wrapper">
                    {
                        this.state.trendingGames.map((game, index) => {
                            let isInWishlist = false;
                            if(this.state.loggedIn && this.state.user){
                                for(let i = 0; i < this.state.user.wishlistedGames.length; ++i){
                                    if (this.state.user.wishlistedGames[i].gameID == game.gameId)
                                        isInWishlist = true;
                                }
                            }
                            return(
                                <Carousel.Item interval={2000} className="img-responsive">
                                    <Link to={"game-detail/" + game.gameId}>
                                        <img
                                            className="d-block w-100"
                                            src={game.info.thumb}
                                            alt={"Slide " + (index + 1)}
                                            style={{height: 500}}
                                        />
                                        <Carousel.Caption>
                                            <h2 style={{fontFamily: 'Russo One', sanSerifs: true, fontSize: 40, backgroundColor: 'rgba(34, 204, 242, 0.7)', display: 'inline', paddingLeft: 20, paddingRight: 20}}>{game.info.title}</h2>
                                            <br/>
                                            <p className="badge badge-danger" style={{fontFamily: 'Roboto', sansSerif: true, marginTop: 10, fontSize: 30}}>{game.deals[0].price}$ ({Math.floor(game.deals[0].savings)}% Off!)</p>
                                        </Carousel.Caption>
                                    </Link>
                                </Carousel.Item>
                            )
                        })
                    }
                </Carousel>}
                
                    
                                    
                <div className="row" style={{marginTop: 20, marginBottom: 20}}>
                    <div className="col text-center">
                        <Link className="btn btn-primary" to="viewList"><strong>View All Trending Games</strong></Link>
                    </div>
                </div>
                {this.state.storeGamesAll &&
                this.state.storeGamesAll.map(eachStoreGames => {
                    //console.log(eachStoreGames);
                    //console.log(this.state.storeArr);
                    let theStore = {};
                    this.state.storeArr.map((store, idx) => {
                        if (store){
                            if(store.storeID === eachStoreGames[0].storeID){
                                theStore = store;
                            }
                        }
                    })
                    return(
                        <div>
                            <h3 style={{fontFamily: 'Russo One', sanSerifs: true}}>{theStore.storeName}'s Hot Deals:</h3>
                            {<Slider user={this.state.user} loggedIn={this.state.loggedIn}>
                            {eachStoreGames.map(game => (
                                <Slider.Item game={game} key={game.gameID}>{game.title}</Slider.Item>
                            ))}
                            </Slider>
                            }
                        </div>
                    )
                })}

            <>{
                this.state.redirect ? 
                <div className="account-created-text">
                    <p>Account was successfully created. Please log in now.</p>
                </div>
                :
                <p></p>
            }</>
            
            </div>
        )
    }
  }

  export default withRouter(Home);