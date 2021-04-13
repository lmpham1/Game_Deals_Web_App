import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { withAlert } from 'react-alert';
import Switch from "react-switch";
import { FaGithub, FaCaretUp, FaGripLines, FaCaretDown } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; import './App.css';
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
            change: 0,
            sorting: false,
            sortIcon: false
        }
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }


    handleSwitch(checked, gameID, userID, email, index) {
        console.log(checked);
        this.setState({ switch: checked });
        //Updates database 
        fetch(`http://localhost:8080/api/updateNotif/${userID}/${checked}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gameID: gameID })
        }).then(res => console.log(res))
            .catch(error => { console.log(error) });

        if (checked == true) {
            var inputPrice = prompt("Enter alert price");

            //Create alert
            CreateAlert(gameID, userID, email, inputPrice);
            this.setState({ alertPrice: inputPrice });

            //Notifcation
            toast.success(
                <div className="media">
                    <p className="media-body">Notification created</p>
                </div>);
            console.log("hereeeeeeeee")
            console.log(index)
            var temporary = this.state.wishlistedGames;
            temporary[index].notifSwitch = true;
            temporary[index].priceToBeNotified = inputPrice;
            this.setState({ wishlistedGames: temporary });
        }
        else {
            DeleteAlert(gameID, userID, email);
            toast.error(
                <div className="media">
                    <p className="media-body">Notification deleted</p>
                </div>);
            var temporary = this.state.wishlistedGames;
            temporary[index].notifSwitch = false;
            temporary[index].priceToBeNotified = null;
            this.setState({ wishlistedGames: temporary });
        }
    }

    handleSort(e) {
        let temp = this.state.wishlistedGames;

        this.setState({ sortIcon: true })
        if (this.state.sorting) {
            temp.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
            this.setState({ wishlistedGames: temp })
            this.setState({ sorting: false })
            console.log("he")
        } else {
            temp.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
            this.setState({ wishlistedGames: temp })
            this.setState({ sorting: true })

        }
        console.log("here")
        console.log(this.state.wishlistedGames)

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
                            if (json.deals) {
                                if (json.deals[0].price) {
                                    tempDeals.push(json.deals[0].price)
                                }
                                else {
                                    tempDeals.push(0);
                                }
                            }
                            else {
                                tempDeals.push(0);
                            }
                        })
                }
                this.setState({ gameDeals: tempDeals })
                this.setState({ isLoaded: true })
                console.log(res.data);
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
                    <DisplayWhislist sorting={this.state.sorting} sortIcon={this.state.sortIcon} handleSort={this.handleSort} handleSwitch={this.handleSwitch} forceUpdate={forceUpdate} wishlist={this.state.wishlistedGames} loggedIn={this.props.loggedIn} prices={this.state.gameDeals} userId={this.state.userId} rrows={this.state.rrows} email={this.state.email} alert={this.props.alert} switch={this.state.switch} />
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
                <div class="d-flex justify-content-center">
                    <br></br>
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
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
                    <TableHeader sorting={props.sorting} sortIcon={props.sortIcon} handleSort={props.handleSort} />
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
const DeleteAlert = (gameID, userID, email) => {
    fetch(`https://www.cheapshark.com/api/1.0/alerts?action=delete&email=${email}&gameID=${gameID}`)
        .then(res => {
            if (res.ok) {
                fetch(`http://localhost:8080/api/addPrice/${userID}/null`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ gameID: gameID })
                }).then(console.log(res))
                    .catch(error => { console.log(error) });
                //props.alert.success("Your alert has been deleted.");
            }
            else {
                //props.alert.error("Error: Alert could not be deleted.");
            }
        })
        .catch(error => console.log('error', error));
}

const TableHeader = (props) => {
    /*var s;
    if(props.sorting){
        s= <th class="aaa" onClick={() => props.handleSort(props)}>Icon  <FaCaretDown/> </th>
    }else{
        s =<th class="aaa" onClick={() => props.handleSort(props)}>Icon  <FaCaretUp/> </th>
    }
    return (
        <thead>
            <tr>
               { props.sortIcon == false ? <th class="aaa" onClick={() => props.handleSort(props)}>Icon  <FaGripLines/> </th>               
               :
               (s)
               }
                <th>Game Title</th>
                <th>Current Price</th>
                <th>Alert Price</th>
                <th>Notification</th>
                <th>Remove</th>
            </tr>
        </thead>
    )*/
    var s;
    if (props.sorting) {
        s = <th class="aaa" onClick={() => props.handleSort(props)}>Date Added <FaCaretDown /> </th>
    } else {
        s = <th class="aaa" onClick={() => props.handleSort(props)}>Date Added <FaCaretUp /> </th>
    }
    return (
        <thead>
            <tr>
                <th>Icon </th>
                <th>Game Title</th>
                <th>Current Price</th>
                {props.sortIcon == false ? <th class="aaa" onClick={() => props.handleSort(props)}>Date Added <FaGripLines /> </th>
                    :
                    (s)
                }
                <th>Alert Price</th>
                <th>Notification</th>
                <th>Remove</th>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    //console.log(props);
    const [rrow, setRows] = useState(props.wishlist);
    const removeRow = (obj) => {
        let temp = rrow;
        //temp.pop();

        let idx = null;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].gameID == obj.gameID) {
                idx = i;
                break;
            }
        }

        // manually remove the game 
        //! ^^ find better way to fix
        temp.splice(idx, 1);
        setRows(rrow => temp);
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
            .then(removeRow(props))

    }

    const rows = rrow.map((item, index) => {
        return (
            <TableRow handleSwitch={props.handleSwitch} removeGame={removeGame} item={item} index={index} prices={props.prices} userId={props.userId} email={props.email} switch={props.switch} />
        )
    })
    return (
        <tbody>
            {rows}
        </tbody>
    )
}

const TableRow = (props) => {

    if (props.item.date) {
        var dateString = props.item.date.substring(0, 10)
    }
    return (
        <tr>
            <td><Link to={`/game-detail/${props.item.gameID}`}><img class="storeImg" src={props.item.thumb} alt="Responsive image" width={50} height={50} /></Link></td>
            <td><Link to={`/game-detail/${props.item.gameID}`}>{props.item.name}</Link></td>
            <td>${props.item.salePrice}</td>
            <td>{props.item.date ? dateString : "No Date"}</td>
            <td>{props.item.priceToBeNotified == null ? "None Set" : "$" + props.item.priceToBeNotified}</td>

            <td>
                {<Switch onChange={() => props.handleSwitch(!props.item.notifSwitch, props.item.gameID, props.userId, props.email, props.index)} checked={props.item.notifSwitch} />}
            </td>

            <td><button type="button" onClick={() => props.removeGame(props.item, props.userId)} class="btn btn-danger" href="#collapseExample">Remove from List</button></td>
        </tr>
    )
}
//export default Wishlist;
export default withAlert()(Wishlist);