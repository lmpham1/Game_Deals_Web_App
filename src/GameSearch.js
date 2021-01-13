import React, { Component } from "react";
import {Link, withRouter, Redirect} from "react-router-dom";
//import NumberFormat from 'react-number-format';
import './App.css';

class GameSearch extends React.Component{

    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    state = { games: [], stores: [], deals: [], search: "", url: "https://agile-sands-96303.herokuapp.com/api/search/", isLoading: false, isEmpty: true};

    handleChange(e) {

        this.setState({ search: e.target.value.replace(/\s/g, '%20') , games: [], stores: [], deals: [], isLoading: true, isEmpty: true});
        if (!this.state.search == ""){
        fetch(this.state.url + this.state.search).then(response =>{
            if (response.ok){
                return response.json();
            }
            else if (response.status === 404){
                throw Error("HTTP 404, Not Found");
            } else {
                throw Error(`HTTP ${response.status}, ${response.statusText}`);
            }
        }).then(responseData =>{
            //console.log(responseData);
            this.setState({ games: responseData});
            if (this.state.games.length > 0){
                this.setState({ isEmpty: false});
            }
            //console.log(this.state.games);
            this.state.games.map((game, index)=>{
                fetch(`https://agile-sands-96303.herokuapp.com/api/deal/${game.cheapestDealID}`)
                .then(response => {
                    if (response.ok){
                        return response.json();
                    }
                    else if (response.status === 404){
                        throw Error("HTTP 404, Not Found");
                    } else {
                        throw Error(`HTTP ${response.status}, ${response.statusText}`);
                    }
                }).then(responseData =>{
                    //console.log(responseData);
                    this.setState(state=>{
                        const deals = state.deals.concat(responseData);
                        return {
                            deals
                        }
                    })

                    fetch(`https://agile-sands-96303.herokuapp.com/api/store/${responseData.gameInfo.storeID}`)
                    .then(response => {
                        if (response.ok){
                            return response.json();
                        }
                        else if (response.status === 404){
                            throw Error("HTTP 404, Not Found");
                        } else {
                            throw Error(`HTTP ${response.status}, ${response.statusText}`);
                        }
                    }).then(responseData =>{
                        //console.log(responseData);
                        this.setState(state=>{
                            const stores = state.stores.concat(responseData);
                            return {
                                stores
                            }
                        })
                        this.setState({isLoading: false})
                    
                }).catch(error => {
                    console.log(error);
                })
        }).catch(error => {
            console.log(error);
        })
    })
}).catch(error => {
    console.log(error);
})
        }
    }

    componentDidMount(){
        
        
        
    };

    render(){
        document.title = "Search results for \"" + this.state.search + "\""
        let loading;
        if (this.state.isLoading){
            loading = <p>Your result is loading...</p>
        }
        else loading = <></>;
        
        return(
            <div>
                <div className="md-form active-purple active-purple-2 mb-3">
                    <input className="form-control" type="text" placeholder="Search for a game title" aria-label="Search" name="search" onChange={this.handleChange}/>
                </div>
                {loading}
                <DisplayContent isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} games={this.state.games} stores={this.state.stores} deals={this.state.deals}/>
            </div>
        );
    }
}

const DisplayContent = (props) => {
    if (!props.isEmpty){
        return( 
            <div>
                <h4>Search results:</h4>
                <table className="table table-striped">
                    <TableHeader />

                    <TableBody games={props.games} stores={props.stores} deals={props.deals}/>
                </table>
            </div>
        )
    }else if(props.isLoading){
        return <></>;
    }
    else return( 
            <div>
                No Games Found!
            </div>
    )
};

const TableHeader = () =>{
    return(
        <thead>
            <tr>
                <th>Icon</th>
                <th>Game Title</th>
                <th>Store</th>
                <th>Current Price</th>
                <th>Original Price</th>
                <th>Saved Amounts</th>
            </tr>
        </thead>
    )
}

const TableBody = (props) =>{
    const rows = props.games.map((game, index)=>{
        var store = {};
        var deal = {};
        //console.log(props.deals);
        //console.log(props.stores)
        for (let i = 0; i < props.deals.length; ++i){
            
            if (game.gameID == props.deals[i].gameInfo.gameID){
                //console.log(props.deals);
                deal = props.deals[i];
                for (let j = 0; j < props.stores.length; ++j){
                    if (deal.gameInfo.storeID == props.stores[j].storeID){
                        store = props.stores[j];
                        
                        return (<TableRow game={game} key={index} store={store} deal={deal}/>)
                    }
                }
                break;
            }
        }
        
        //console.log(game);
        //console.log(store)
        //console.log(deal);
    })
    return (
        <tbody>
            {rows}
        </tbody>
    )
}

const TableRow = (props) =>{
    const g = props.game;
    //console.log("gm value");
    //console.log(gm);
    let flag = false;
    let save = 0;
    if (props.deal.gameInfo){
        flag = true;
        save = (props.deal.gameInfo.salePrice - props.deal.gameInfo.retailPrice) / props.deal.gameInfo.retailPrice * 100;
    }
    if (flag){
        //console.log(deal);
        return(
            <tr>
                <td><Link to={`/game-detail/${g.gameID}`}><img src={g.thumb} alt={g.internalName} width={50} height={50}/></Link></td>
                <td><Link to={`/game-detail/${g.gameID}`}>{g.external}</Link></td>
                <td>{props.store.storeName}</td>
                <td>{props.deal.gameInfo.salePrice}$</td>
                <td>{props.deal.gameInfo.retailPrice}$</td>
                <td>{save.toFixed(2)}%</td>
            </tr>
        );
    }
    else{
        return(
            <tr>
                    <td><img src={g.thumb} alt={g.internalName} width={50} height={50}/></td>
                    <td>{g.external}</td>
                    <td>{props.store.storeName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                </tr>
        )
    }
    //return null;
}

export default GameSearch;