import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import './App.css';

class ViewList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            thumbnail: null,
            cheapestDealID: null,
            userId: null,
            loggedIn: false,
            rrows: null,
            total: true,
            recent: false,
            history: [],
            gamesList: [],
            recentList: [],
            noViews: null,
            dealsOn: false
        }

        //console.log("in componentdidmount");
        let gameTemp = []
        let tempo = []
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/api/db/viewedGames",
        }).then((res) => {
            //console.log(res.data);
            if (res.data) {
                tempo = res.data;
                this.setState({ isLoaded: true });

            }
            else {
                //console.log("no ID");
                this.setState({ noViews: false });
            }
            //onsole.log(res.data);
        }).then(() => {
            if (this.state.isLoaded) {
                for (let i = 0; i < tempo.length; ++i) {

                    fetch(`https://agile-sands-96303.herokuapp.com/api/game/${tempo[i].gameId}`)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            else
                                throw Error("HTTP 404, Not Found");
                        }).then((json) => {
                            //console.log(json.deals[0].price)
                            //console.log("JJOOOOOOOOOOOOOOOOOOOOOO")
                            tempo[i]["deals"] = json.deals[0].price;
                            tempo[i]["thumb"] = json.info.thumb;
                        }).then((re)=>{
                            this.setState({dealsOn: true})
                        }).catch((err) => {
                            console.log("ERROR" + err)
                        })
                }
                
                this.setState({gamesList: tempo})
            }
        });
    }

    componentDidMount() {
        let tempo = []
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/api/db/viewedRecentGames",
        }).then((res) => {
            //console.log(res.data);
            if (res.data) {
                tempo = res.data;
                this.setState({ isLoaded: true });

            }
            else {
                //console.log("no ID");
                this.setState({ noViews: false });
            }
            //console.log(res.data);
        }).then(() => {
            if (this.state.isLoaded) {
                for (let i = 0; i < tempo.length; ++i) {

                    fetch(`https://agile-sands-96303.herokuapp.com/api/game/${tempo[i].gameId}`)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            else
                                throw Error("HTTP 404, Not Found");
                        }).then((json) => {
                            //console.log(json.deals[0].price)
                            //console.log("JJOOOOOOOOOOOOOOOOOOOOOO")
                            tempo[i]["deals"] = json.deals[0].price;
                            tempo[i]["thumb"] = json.info.thumb;
                        }).then((re)=>{
                            this.setState({dealsOn: true})
                        }).catch((err) => {
                            console.log("ERROR" + err)
                        })
                }
                
                this.setState({recentList: tempo})
            }
        });
    }

    render() {
        const forceUpdate = () => {
            this.setState(this.state);
            this.forceUpdate();
        }
        var { isLoaded, items } = this.state;
        //console.log(this.state)
        var { dealsOn, items } = this.state;
        if (!isLoaded && !dealsOn) {
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
            if (!isLoaded && !dealsOn) {
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
                if (this.state.gamesList.length == 0) {
                    return (
                        <div>
                            <h3>No Games at the moment.</h3>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            {this.state.total == true &&<h2 class="headTask">Top 20 Most Viewed Games!</h2>}
                            {this.state.recent == true && <h2 class="headTask">Top 10 Most Recent Viewed Games!</h2>}
                            <div class="btn-group float-right" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-secondary" onClick={() => {this.setState({recent: true}); this.setState({total: false});}}> Recent View</button>
                                    <button type="button" class="btn btn-secondary" onClick={() => {this.setState({recent: false}); this.setState({total: true});}}> Total View</button>
                                </div>
                            {this.state.total == true && <DisplayList rrows={this.state.rrows} forceUpdate={forceUpdate} gamesList={this.state.gamesList} isLoaded={this.state.isLoaded} />}
                            {this.state.recent == true && <DisplayList rrows={this.state.rrows} forceUpdate={forceUpdate} gamesList={this.state.recentList} isLoaded={this.state.isLoaded} />}
                        </div>
                    )
                }
            }
        }
    }

}
const DisplayList = (props) => {
    if ( props.isLoaded) {
        return (
            <div>
                <table className="table table-striped">
                    <TableHeader />
                    <TableBody rrows={props.rrows} forceUpdate={props.forceUpdate} gamesList={props.gamesList} isLoaded={props.isLoaded} />
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
                <th>Current Price</th>
                <th></th>
            </tr>
        </thead>
    )
}
// Will take one less.
const TableBody = (props) => {
    const [rrow, setRows] = useState(props.gamesList);
    //console.log(props.gamesList.deals)
    const rows = rrow.map((item, index) => {
        //console.log("ssssssssssssssss11111111")
        //console.log(item.deals)
        if (item.gameId && item.deals) {
            return (
                <TableRow item={item} index={index} />
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
    //console.log(props.item.deals)
    //console.log(props)
    return (
        <tr>
            <td><Link to={`/game-detail/${props.item.gameId}`}><img class="storeImg" src={props.item.thumb} alt="image" width={50} height={50} /></Link></td>
            <td><Link to={`/game-detail/${props.item.gameId}`}>{props.item.gameName}</Link></td>
            <td>${props.item.deals}</td>
        </tr>
    )
}
export default ViewList;