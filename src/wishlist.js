import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { withAlert } from 'react-alert';
import Switch from "react-switch";
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
            alertPrice: null,
            alert: null,
            switch: false,
            change: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
    }

    handleChange(e) {
        this.setState({ alertPrice: e });
        console.log(this.state.alertPrice);
    }

    handleSwitch(checked, gameID, userID, email) {
        console.log(checked);
        this.setState({ switch: checked });
        console.log("gameID: " + gameID + " userID: " + userID + " email: " + email);
        
        if (checked == true) {
            var inputPrice = prompt("Enter alert price");
            CreateAlert(gameID, userID, email, inputPrice);
        }
        else {
            //Call deleteAlert

            console.log("Switched off!");
        }

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
                this.setState({ email: res.data.email });
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
                this.setState({ email: res.data.email });
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
        const forceUpdate = () => {
            this.setState(this.state);
            this.forceUpdate();
        }
        console.log(this.state);  

        if (this.state.isLoaded) {
            return (
                <div>
                    <DisplayWhislist handleSwitch={this.handleSwitch} forceUpdate={forceUpdate} wishlist={this.state.wishlistedGames} loggedIn={this.props.loggedIn} prices={this.state.gameDeals} userId={this.state.userId} rrows={this.state.rrows} email={this.state.email} alert={this.props.alert} switch={this.state.switch} />
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
    if (props.wishlist.length > 0 && props.loggedIn) {
        return (
            <div>
                            <h4>Your WishListed Games!</h4>
                            <table className="table table-striped">
                                <TableHeader />
                                <TableBody handleSwitch={props.handleSwitch} forceUpdate={props.forceUpdate} wishlist={props.wishlist} prices={props.prices} userId={props.userId} rrows={props.rrows} email={props.email} alert={props.alert} switch={props.switch}></TableBody>
                            </table>
                        </div>
        )
    } else {
        return (
            <div> No games in your wishlist!</div>
        )
    }
}

//Function to generate notification alerts
const CreateAlert = (gameID, userID, email, alertPrice) => {
                            fetch(`https://www.cheapshark.com/api/1.0/alerts?action=set&email=${email}&gameID=${gameID}&price=${alertPrice}`)
                                .then(res => {
                                    if (res.ok) {
                                        console.log(`http://localhost:8080/api/addPrice/${userID}/${alertPrice}`)
                                        fetch(`http://localhost:8080/api/addPrice/${userID}/${alertPrice}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ gameID: gameID })
                                        }).then(console.log(res))
                                            .catch(error => { console.log(error) });
                                        //props.alert.success("Alert created");
                                    }
                                    else {
                                        //props.alert.error("Error: Could not create alert");
                                    }
                                })
                                .catch(error => console.log('error', error));
}

//Function to delete notification alerts
const DeleteAlert = (props) => {
                            fetch(`https://www.cheapshark.com/api/1.0/alerts?action=delete&email=${props.email}&gameID=${props.wishlist.gameID}`)
                                .then(res => {
                                    if (res.ok) {
                                        fetch(`http://localhost:8080/api/addPrice/${props.userId}/null`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ gameID: props.wishlist.gameID })
                                        }).then(console.log(res))
                                            .catch(error => { console.log(error) });
                                        props.alert.success("Your alert has been deleted.");
                                    }
                                    else {
                                        props.alert.error("Error: Alert could not be deleted.");
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
                                <th>Alert Price</th>
                                <th>Notification</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
    )
}

const TableBody = (props) => {
                            console.log(props);
    const [rrow, setRows] = useState(props.wishlist);
    const removeRow = () =>{
                            let temp = rrow;
        temp.pop();
        setRows(rrow=>temp);
        console.log(rrow);
        props.forceUpdate();
    }
        const removeGame = (props, userId) => {
                            fetch(`http://localhost:8080/api/removeGame/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(props)
                            })
                                .then(async data => await data.json())
                                .then(removeRow())

                        }

    const rows = rrow.map((item, index) => {
        var img = item.thumb;
        var alertPrice = item.priceToBeNotifed;

        //The problem is likely that switch is a local component state which applies to all rows. When I change state for one, it updates for all. Need to update only what I click somehow OR add switch state into
        //the actual schema so I can save state and load for each game in wishlist. Maybe make a conditional statement where it checks priceToBeNotified is null or not, if null, state is off, if !null, state is on
        return (
            <tr>
                            <td><Link to={`/game-detail/${item.gameID}`}><img class="storeImg" src={img} alt="Responsive image" width={50} height={50} /></Link></td>
                            <td><Link to={`/game-detail/${item.gameID}`}>{item.name}</Link></td>
                            <td>${props.prices[index]}</td>
                            <td>{alertPrice == null ? "None" : "$" + alertPrice}</td>

                            {/* <td>
                {alertPrice == null ? <Switch onChange={props.handleSwitch} checked={alertPrice}/> : <Switch onChange={props.handleSwitch} checked={alertPrice}/> }
            </td> */}

                            <td>
                                {/* {<Switch onChange={props.handleSwitch} checked={props.switch} gameID={item.gameID} userID={props.userId} email={props.email}/>} */}
                                {<Switch onChange={() => props.handleSwitch(props.switch, item.gameID, props.userId, props.email)} checked={props.switch}/>}
                                {/* {<Switch onChange={props.handleSwitch} checked={props.switch}/>} */}
                            </td>


                            {/* <td>
                <button type="button" class="btn btn-primary" onClick={() => CreateAlert(props, document.getElementById(props.wishlist.gameID))}>
                    Create Alert
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" onClick={() => DeleteAlert(props)}>
                    Delete Alert
                </button>
            </td> */}
                            <td><button type="button" onClick={() => removeGame(item, props.userId)} class="btn btn-danger" href="#collapseExample">Remove from List</button></td>
                        </tr>
            )
    })
    return (
        <tbody>
                            {rows}
                        </tbody>
    )
}
//export default Wishlist;
export default withAlert()(Wishlist);