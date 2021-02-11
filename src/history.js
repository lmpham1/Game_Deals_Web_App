import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

toast.configure()
class History extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            thumbnail: null,
            cheapestDealID: null,
            userId: null,
            loggedIn: false,
            rrows: null,
            tableView: true,
            cardView: false,
            history: []
        }
    }

    componentDidMount() {
        console.log("in componentdidmount");
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/user",
          }).then((res) => {
            if (res.data._id) {
                console.log("has ID");
                this.setState({ loggedIn: true });
                this.setState({ userId: res.data._id });
                this.setState({ history: res.data.searchHistory });
                this.setState({ isLoaded: true });
            }
            else {
                console.log("no ID");
                this.setState({ loggedIn: false });
            }
            console.log(res.data);
          });
    }

    render() {
        const forceUpdate = () => {
            this.setState(this.state);
            this.forceUpdate();
        }
        var { isLoaded, items } = this.state;
        console.log(this.state)

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
            if (!isLoaded) {
                return (
                    <div class="d-flex justify-content-center">
                    <br></br>
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    </div>
                );
            }
            else {
                document.title = "Search History";
                if (this.state.history.length == 0) {
                    return (
                        <div>
                            <h3>Empty history</h3>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <h3>Recent History<span>
                                <div class="btn-group float-right" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-primary" onClick={() => {this.setState({cardView: true}); this.setState({tableView: false});}}><i class="fa fa-th-large" aria-hidden="true"></i> Card View</button>
                                    <button type="button" class="btn btn-danger" onClick={() => {this.setState({cardView: false}); this.setState({tableView: true});}}><i class="fa fa-table" aria-hidden="true"></i> Table View</button>
                                </div>
                            </span></h3>
                            {this.state.cardView == true && <DisplayCardView userId = {this.state.userId} rrows={this.state.rrows} forceUpdate={forceUpdate} history={this.state.history} loggedIn={this.state.loggedIn}/>}
                            {this.state.tableView == true && <DisplayHistory userId = {this.state.userId} rrows={this.state.rrows} forceUpdate={forceUpdate} history={this.state.history} loggedIn={this.state.loggedIn}/> }
                        </div>
                    )
                }
            }
        }
    }

}

 const DisplayCardView = (props) => {
     return (
        <div>
            <CardBody userId = {props.userId} rrows={props.rrows} forceUpdate={props.forceUpdate} history={props.history} loggedIn={props.loggedIn}/>
        </div>
     )
 }


const CardBody = (props) => {
    const [rrow, setRows] = useState(props.history);

    const notify = (game) => {
        toast.error(`${game[0].name} has been removed.`);
    }

    const removeRow = (obj) =>{
        let temp = rrow;
        //temp.pop();

        let idx = null;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].gameID == obj.gameID) {
                idx = i;
                break;
            }
        }

        let removedGame = temp.splice(idx, 1);
        setRows(rrow=>temp);
        console.log(rrow);
        notify(removedGame);
        props.forceUpdate();
    }
        const removeGame = (props, userId) => {
                            fetch(`http://localhost:8080/api/history/pop/${userId}`, {
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
        if (item.gameID) {
            return (
                <div class = "col mb-4 cardView">
                    <SingleCardView userId = {props.userId} removeGame={removeGame} item={item} index={index}/>
                </div>
            )
        }
    })

    return (
        <div class = "row row-cols-1 row-cols-3">
            {rows}
        </div>
    )
}


const SingleCardView = (props) => {
    let date = new Date(props.item.date);
    let time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let day = date.toLocaleString('en-US', {weekday: 'short', month: 'short', day: '2-digit'})

    return (
        <div class = "card">
            <div>
                <img src = {props.item.thumb} class = "card-img-top cardImg"/>
                <badge type="button" onClick={() => props.removeGame(props.item, props.userId)} class="badge badge-danger removeBtn" href="#collapseExample">X</badge>
            </div>
            <div class = "card-body">
                <h3><Link to={`/game-detail/${props.item.gameID}`}>{props.item.name}</Link></h3>
                <p><b>Cheapest Price: </b>${props.item.salePrice}</p>
            </div>
            <div class = "card-footer">
                <small class="text-muted"><b>Date of Visit: </b>{day} | {time}</small>
            </div>
        </div>
    )
}
const DisplayHistory = (props) => {
    if (props.history.length > 0 && props.loggedIn) {
        return (
            <div class = "table-responsive">
                <table class="table table-striped tableView">
                    <TableHeader/>
                    <TableBody userId = {props.userId} rrows={props.rrows} forceUpdate={props.forceUpdate} history={props.history} loggedIn={props.loggedIn}/>
                </table>
            </div>
        )
    }
}

const TableHeader = () => {
    return (
        <thead>
            <tr>    
                <th>Icon</th>
                <th>Game Title</th>
                <th>Cheapest Price</th>
                <th>Date of Visit</th>
                <th></th>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    const [rrow, setRows] = useState(props.history);

    const notify = (game) => {
        toast.error(`${game[0].name} has been removed.`);
    }

    const removeRow = (obj) =>{
        let temp = rrow;
        //temp.pop();

        let idx = null;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].gameID == obj.gameID) {
                idx = i;
                break;
            }
        }

        let removedGame = temp.splice(idx, 1);
        setRows(rrow=>temp);
        console.log(rrow);
        notify(removedGame);
        props.forceUpdate();
    }
        const removeGame = (props, userId) => {
                            fetch(`http://localhost:8080/api/history/pop/${userId}`, {
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
        if (item.gameID) {
            return (
                <TableRow userId = {props.userId} removeGame={removeGame} item={item} index={index}/>
            )
        }
    })
    return (
        <tbody>
            {rows}
        </tbody>
    )
}

const TableRow = (props) => {
    let date = new Date(props.item.date);
    let time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let day = date.toLocaleString('en-US', {weekday: 'short', month: 'short', day: '2-digit'})

    return (
        <tr>
            <td><Link to={`/game-detail/${props.item.gameID}`}><img class="storeImg" src={props.item.thumb} alt="Responsive image" width={50} height={50} /></Link></td>
            <td><Link to={`/game-detail/${props.item.gameID}`}>{props.item.name}</Link></td>
            <td>${props.item.salePrice}</td>
            <td>{day}<br/>{time}</td>

        <td><badge type="button" onClick={() => props.removeGame(props.item, props.userId)} class="badge badge-danger" href="#collapseExample">X</badge></td>
    </tr>
    )
}
export default History;