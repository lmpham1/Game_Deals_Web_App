import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import './App.css';

class Wishlist extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            wishlistedGames: null,
            gameDeals: [],
            gameID: [],
            isLoaded: false,
            loginComp: false,
            userId: "",
            rrows: null,
            email: "",
            alertPrice: null
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.setState({alertPrice: e});
        console.log(this.state.alertPrice);
    }

    componentWillReceiveProps(nextProps) {
        console.log("WAHHHAHSDHASDH")
        this.setState({ loginComp: nextProps.loggedIn });
        this.setState(this.state);
        console.log(this.props.loggedIn + "HEREEEE")
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/user",
        }).then(async (res) => {
            if (res.data._id) {
                this.setState({ wishlistedGames: res.data.wishlistedGames });
                //Store the deals from the games in wishlist
                let tempDeals = [];
                for (let i = 0; i < this.state.wishlistedGames.length; ++i) {
                    await fetch(`https://agile-sands-96303.herokuapp.com/api/game/${this.state.wishlistedGames[i].gameID}`)
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
                        }).then(json => {
                            console.log(json)
                            if (json.deals[0].price) {
                                tempDeals.push(json.deals[0].price)
                            }
                            else {
                                tempDeals.push(0);
                            }
                        })
                    console.log(tempDeals)
                }
                this.setState({ gameDeals: tempDeals });
                this.setState({ isLoaded: true });
                this.setState({ email: res.data.email});
            }
            else {
                this.setState(this.state);
            }
            console.log(res);
            //On break do this only once and store the value.
        });
    }

    componentDidMount() {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/user",
        }).then(async (res) => {
            if (res.data._id) {
                this.setState({ userId: res.data._id });
                this.setState({ wishlistedGames: res.data.wishlistedGames });
                this.setState({ email: res.data.email});
                let tempDeals = [];
                //Store the deals from the games in wishlist
                for (let i = 0; i < this.state.wishlistedGames.length; ++i) {
                    await fetch(`https://agile-sands-96303.herokuapp.com/api/game/${this.state.wishlistedGames[i].gameID}`)
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
                        }).then(json => {
                            console.log(json)
                            if (json.deals[0].price) {
                                tempDeals.push(json.deals[0].price)
                            }
                            else {
                                tempDeals.push(0);
                            }
                        })
                        console.log(tempDeals)
                }
                this.setState({ gameDeals: tempDeals })
                this.setState({ isLoaded: true })
            }
            else {
                this.setState(this.state);
            }
            console.log(res);
            //On break do this only once and store the value.
        });
    }


    render() {
        console.log(this.state.wishlistedGames)
        if (this.state.isLoaded) {
            return (
                <div>
                    <DisplayWhislist wishlist={this.state.wishlistedGames} loggedIn={this.props.loggedIn} prices={this.state.gameDeals} userId={this.state.userId} rrows={this.state.rrows} email={this.state.email} />
                </div>
            );
        }
        else if (!this.props.loggedIn) {
            return (
                <h2> No user logged!</h2>
            )
        }
        else {
            return (

                <h2> Waiting to load wishlist</h2>
            )
        }
    }
}

const DisplayWhislist = (props) => {
    console.log(props);
    if (props.wishlist.length > 0 && props.loggedIn) {
        return (
            <div>
                <h4>Your WishListed Games!</h4>
                <table className="table table-striped">
                    <TableHeader />
                    <TableBody wishlist={props.wishlist} prices={props.prices} userId={props.userId} rrows={props.rrows} email={props.email}></TableBody>
                </table>
            </div>
        )
    } else {
        return (
            <div> No games in your wishlist!</div>
        )
    }
}

const createAlert = (props, alertPrice) => {      
    console.log(props);  
    fetch("https://www.cheapshark.com/api/1.0/alerts?action=set&email=" + props.email + "&gameID=" + props.wishlist.gameID + "&price=" + alertPrice)
        .then(response => response.text())
        .then(result => {
            if (result) {
                console.log(result);
            }
            else {
                console.log("Alert creation failed.")
            }
        })
        .catch(error => console.log('error', error));
}

const deleteAlert = (props) => {
    fetch("https://www.cheapshark.com/api/1.0/alerts?action=delete&email=" + props.email + "&gameID=" + props.wishlist.gameID + "&price=")
        .then(response => response.text())
        .then(result => {
            if (result) {
                console.log(result)
            }
            else {
                console.log("Could not delete alert")
            }
        })
        .catch(error => console.log('error', error));
}

const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>Icon</th>
                <th>Game Title</th>
                <th>Current Price</th>
                <th>Current Alert Threshold</th>
                <th>Notification</th>
                <th></th>
                <th></th>
                <th>Remove</th>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    console.log("hey")
    console.log(props.prices)
    const rows = props.wishlist.map((item, index) => {
        return <TableRow wishlist={item} price={props.prices[index]} userId={props.userId} email={props.email}/>
    })
    return (
        <tbody>
            {rows}
        </tbody>
    )
}
const removeGame = (props, userId) => {
    fetch(`http://localhost:8080/api/removeGame/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })
        .then(data => data.json())
        .then(res => console.log(res));
}

const TableRow = (props) => {
    var img = props.wishlist.thumb;
    return (
        <tr>
            <td><Link to={`/game-detail/${props.wishlist.gameID}`}><img class="storeImg" src={img} alt="Responsive image" width={50} height={50} /></Link></td>
            <td><Link to={`/game-detail/${props.wishlist.gameID}`}>{props.wishlist.name}</Link></td>
            <td>${props.price}</td>
            <td>
                <input type="text" class="form-control" id={props.wishlist.gameID} placeholder="Input Alert Price Here... "></input>
            </td>
            <td>
                <button type="button" class="btn btn-primary" onClick={() => createAlert(props, document.getElementById(props.wishlist.gameID).value)}>
                    Create Alert
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" onClick={() => deleteAlert(props)}>
                    Delete Alert
                </button>
            </td>
            <td><button type="button" onClick={() => removeGame(props.wishlist, props.userId)} class="btn btn-primary" href="#collapseExample">Remove</button></td>
        </tr>
    )
}
export default Wishlist;