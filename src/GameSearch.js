import React, { Component } from "react";
import {Link, withRouter, Redirect} from "react-router-dom";
import Axios from 'axios';
import Slider from '@material-ui/core/Slider';
import MultiSelect from "react-multi-select-component";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {toast} from 'react-toastify';
import {FacebookShareButton, TwitterShareButton} from "react-share";
import {FacebookIcon, TwitterIcon} from "react-share";
import './App.css';

class GameSearch extends React.Component{

    constructor(props){
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleOnSaleFilter = this.handleOnSaleFilter.bind(this);
        this.handleStoreFilter = this.handleStoreFilter.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);

        this.handlePageClick = this.handlePageClick.bind(this);

        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleSaveFilter = this.handleSaveFilter.bind(this);
        this.handleOpenFilter = this.handleOpenFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);

        this.handleAddGameToWishList = this.handleAddGameToWishList.bind(this);
        this.handleRemoveGameFromWishlist = this.handleRemoveGameFromWishlist.bind(this);

        this.handleCopy = this.handleCopy.bind(this);
        this.notifyCopy = this.notifyCopy.bind(this);
    }

    state = { 
        games: [], 
        stores: [], 
        deals: [], 
        search: "", 
        url: "https://agile-sands-96303.herokuapp.com/api/search/", 
        isLoading: false, 
        isEmpty: true,
        searchBtnClicked: false,
        
        priceRange: [0, 500], 
        storeFilter: [], 
        onSaleFilter: false, 
        sortBy: 0,
        
        currentPageGames: [],
        currentPageNo: 0,
        pageIsClicked: false,

        showFilter: false,
        saveChangesClicked: false,

        loggedIn: false,
        userId: null
    };

    //handle Search String Changes
    handleChange(e) {
        this.setState({ search: e.target.value.replace(/\s/g, '%20') });
    }
    
    //handle Search Button Click
    handleSearch(e) {
        //console.log(e.target.value);

        this.setState({games: [], deals: [], isLoading: true, isEmpty: true, searchBtnClicked: true, currentPageGames: [],
            currentPageNo: 0});

        if (!this.state.search == ""){
            
            //fetch games using search term
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
                
                this.setState({ games: responseData});
                if (this.state.games.length > 0){
                    this.setState({isEmpty: false});
                }
                //console.log(this.state.games);
                var currentPage = this.state.games.length > 10 ? this.state.games.slice(0, 10) : this.state.games.slice(0, this.state.games.length);
                this.setState({currentPageGames: currentPage});
                //fetch deals
                this.state.games.map((game, index)=>{
                    fetch(`https://www.cheapshark.com/api/1.0/deals?id=${game.cheapestDealID}`)
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
                        this.setState({ isLoading: false });
                    }).catch(error => console.log(error)); //end of deals fetch handling
                })
            }).catch(error => console.log(error)); //end of games fetch handling
        }
        else {
            this.setState({ isLoading: false });
        }
        //end of if statement
    } //end of handleSearch

    //For the copy to clipboard button
    handleCopy(gameObj) {
        console.log(gameObj);
        navigator.clipboard.writeText(window.location.href + "game-detail/" + gameObj.gameID);
        this.notifyCopy(gameObj);
    }

    componentDidUpdate(){
        
    }
    
    componentDidMount(){
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

        fetch(`https://agile-sands-96303.herokuapp.com/api/stores`).then(response =>{
            if (response.ok){
                return response.json();
            }
            else if (response.status === 404){
                throw Error("HTTP 404, Not Found");
            } else {
                throw Error(`HTTP ${response.status}, ${response.statusText}`);
            }
        }).then(responseData =>{
            this.setState(state=>{
                const stores = state.stores.concat(responseData);
                return {
                    stores
                }
            })
            //console.log(this.state.stores);
        }).catch(error => console.log(error));        
    };

    componentWillReceiveProps(nextProps) {
        //this.setState({userId: nextProps.user}) ;
        //this.setState({ loggedIn: nextProps.loggedIn }); 
      }

    handleAddGameToWishList(gameObj){
        //console.log(user);
        fetch(`http://localhost:8080/api/addGame/${this.state.userId._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameObj)
        })
        .then(data => data.json())
        .then((res) => {
            //console.log(res);
            
            this.setState({userId: res});
        })
        .catch(err => console.log(err));
    }

    handleRemoveGameFromWishlist(gameObj){
        fetch(`http://localhost:8080/api/removeGame/${this.state.userId._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameObj)
        })
        .then(data => data.json())
        .then(res => {
            this.setState({userId: res});
            console.log(res);
        })
        .catch(err => console.log(err));
    }

    handlePageClick(currentPage, currentNo){
        this.setState({currentPageGames: currentPage});
        this.setState({currentPageNo: currentNo});
        this.setState({pageIsClicked: true});
        console.log(currentPage);
        console.log(currentNo);
    }

    //handle Price Filter Changes
    handleSliderChange(range){
        
        //console.log(range);
        this.setState({ priceRange: range});
    };
    
    //handle Store Filter Changes
    handleStoreFilter(selectedStores){
        this.setState({ storeFilter: selectedStores});
        //console.log(this.state.storeFilter);
    }

    //handle On Sale Filter Changes
    handleOnSaleFilter(value){
        if (value)
            this.setState({ onSaleFilter: true })
        else
            this.setState({ onSaleFilter: false })
        //console.log(this.state.onSaleFilter);
    };

    //handle Sorting
    handleSortChange(option){
        this.setState({sortBy: option})
        //console.log(option);
    }

    handleOpenFilter(){
        this.setState({ showFilter: true });
    }

    handleCloseFilter(){
        /*
        if (!this.state.saveChangesClicked){
            this.handleResetFilter();
        }*/
        this.setState({ showFilter: false });
    }

    handleSaveFilter(){
        this.setState({ showFilter: false, saveChangesClicked: true })
    }

    handleResetFilter(){
        this.setState({ priceRange: [0, 500], onSaleFilter: false, storeFilter: [], saveChangesClicked: false })
    }

    notifyCopy = (gameObj) => {
        toast.success(
            <div className="media">
                <img src={gameObj.thumb} className="align-self-center mr-3" width={40} height={40}></img>
                <p className="media-body">{gameObj.name} page has been copied to your clipboard.</p>
            </div>);
    }

    render(){
        if (this.state.search != "")
            document.title = "Search results for \"" + this.state.search.replace('%20', " ") + "\"";
        else
            document.title = "Game Deals Search"

        let loading;
        if (this.state.isLoading){
            loading = 
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
        }
        else loading = <></>;

        return(
            <div>
                <div className="form-inline d-flex md-form form-sm mt-0 justify-content-center mb-2">
                        <input className="form-control-sm" style={{width: "93%"}} value={this.state.search.replaceAll('%20', ' ')} type="text" placeholder="Search for a game title" aria-label="Search" name="search" onChange={this.handleChange}/>
                        <input type="submit" className="search-btn" value="Search" onClick={this.handleSearch}/>
                </div>
                
                <div className="float-right form-inline">
                    <Button variant="secondary" className="mr-3" onClick={this.handleOpenFilter}>Filter Settings</Button>
                    <Modal show={this.state.showFilter} onHide={this.handleCloseFilter}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adjust Filters</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Filter handleSliderChange={this.handleSliderChange} priceRange={this.state.priceRange} handleStoreFilter={this.handleStoreFilter} stores={this.state.stores} onSale={this.state.onSaleFilter} handleOnSaleFilter={this.handleOnSaleFilter}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={this.handleResetFilter}>
                                Reset Filter
                            </Button>
                            <Button variant="success" onClick={this.handleSaveFilter}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    
                    <Sort handleSortChange={this.handleSortChange}></Sort>
                </div>
                
                {loading}
                <DisplayContent handleRemoveGameFromWishlist={this.handleRemoveGameFromWishlist} handleAddGameToWishList={this.handleAddGameToWishList} handleCopy={this.handleCopy} loggedIn={this.state.loggedIn} user={this.state.userId} currentPageNo={this.state.currentPageNo} pageIsClicked={this.state.pageIsClicked} currentPageGames={this.state.currentPageGames} handlePageClick={this.handlePageClick} searchBtnClicked={this.state.searchBtnClicked} priceRange={this.state.priceRange} sortBy={this.state.sortBy} search={this.state.search.replaceAll('%20', ' ')} storeFilter={this.state.storeFilter} onSale={this.state.onSaleFilter} isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} games={this.state.games} stores={this.state.stores} deals={this.state.deals}/>
            </div>
        );
    }
}

const Sort = (props) => {
    const handleSortChange = (event) =>{
        props.handleSortChange(event.target.value);
    }

    return(
        <div className="form-inline">
            <label>Sort By: </label>
            <select className="form-control ml-2" onChange={handleSortChange}>
                <option value="0">Best Match</option>
                <option value="1">Game Name</option>
                <option value="2">Sale Price</option>
                <option value="3">Retail Price</option>
                <option value="4">Saved Amount</option>
            </select>
        </div>
    )
}

const Filter = (props) => {
    const[range, setRange] = React.useState(props.priceRange);
    const handleSliderChange = (event, newRange) => {
        setRange(newRange);
        props.handleSliderChange(range);
    }

    const storeOption = props.stores.map(store => {
        return {label: store.storeName, value: store.storeID}
    })

    const [selected, setSelected] = React.useState(storeOption);
    const handleStoreChange = (stores) => {
        //setSelected(e.target.value);
        setSelected(stores);
        //console.log(stores);
        props.handleStoreFilter(stores);
    }

    const handleOnSaleFilter = (event) => {
        props.handleOnSaleFilter(event.target.checked);
    }

    return (
        <ul>
            <li className="form-inline">
                <span>Price: {range[0]}$ - {range[1]}$</span>
                <Slider className="mr-5"value={range} step={5} onChange={handleSliderChange} valueLabelDisplay="auto" aria-labelledby="range-slider" max={500}>
                </Slider>
            </li>
            <li className="form-inline mt-3">
                <span style={{marginRight: "5px"}} >Stores:</span>
                <MultiSelect options={storeOption} hasSelectAll={"false"} value={selected} onChange={handleStoreChange} labelledBy={"Stores"} />
            </li>
            <li className="form-check-inline mt-3">
                <label className="form-check-label">On Sale: </label>
                <input className="form-check-input" type="checkbox" style={{marginLeft: "5px"}} onClick={handleOnSaleFilter}></input>
            </li>
        </ul>
    )
}

const PageList = (props) => {
    if (props.active)
        return <li className="page-item active" key={props.i}><a className="page-link" href="#" id={props.i} onClick={() => props.handlePageClick(props.i)}>{props.i + 1}</a></li>
    else 
        return <li className="page-item" key={props.i}><a className="page-link" href="#" id={props.i} onClick={() => props.handlePageClick(props.i)}>{props.i + 1}</a></li>
}

const DisplayContent = (props) => {
    //console.log(props.user);
    if (!props.isEmpty){
        var games = [...props.games];
        let indexToBeRemoved = [];
        for(let i = 0; i < games.length; ++i){
            let flag = false;
            for(let j = 0; j < props.deals.length; ++j){
                if (games[i].gameID == props.deals[j].gameInfo.gameID){
                    flag = true;
                }
            }
            if (!flag){
                indexToBeRemoved.push(i);
            }
        }
        //console.log(games);
        //console.log(props.deals);
        //console.log(indexToBeRemoved);
        for(let i = indexToBeRemoved.length - 1; i > 0; --i){
            games.splice(indexToBeRemoved[i], 1);
        }
        //console.log(games);
        var noOfGames = games.length;
        var noOfPages = Math.ceil(noOfGames / 10);

        var currentPage = games.slice(0, noOfGames > 10 ? 10 : games.length);
        var currentNo = props.currentPageNo;
        
        const handlePageClick = (pageNo) => {
            currentPage = games.slice(pageNo * 10, (pageNo + 1 == noOfPages ? games.length : pageNo * 10 + 10));
            //console.log("don't call this yet");
            //console.log(pageNo);
            //console.log(props.currentPageGames);
            props.handlePageClick(currentPage, pageNo);
        }

        const handlePrevPageClick = () => {
            if(currentNo > 0){
                currentPage = games.slice(--currentNo * 10, (currentNo + 1 == noOfPages ? games.length : currentNo * 10 + 10));
                props.handlePageClick(currentPage, currentNo);
            }
        }

        const handleNextPageClick = () => {
            console.log(currentNo);
            if (currentNo < noOfPages - 1){
                currentPage = games.slice(++currentNo * 10, (currentNo + 1 == noOfPages ? games.length : currentNo * 10 + 10));
                props.handlePageClick(currentPage, currentNo);
            }
        }

        const Pages = (props) => {
            let pages = [];
            for(let i = 0; i < noOfPages; i++){
                
                let isActive = false;
                if (i == props.currentPageNo)
                    isActive = true;
                pages.push(<PageList i={i} active={isActive} handlePageClick={props.handlePageClick}></PageList>)
            }
            return (pages);
        };
        
        
        return( 
            <div className="mt-3"> 
                { noOfPages > 1 &&                
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className={"page-item" + (props.currentPageNo == 0 ? " disabled" : "")}>
                        <a className="page-link" href="#" aria-label="Previous" onClick={() => handlePrevPageClick()}>
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                        </li>
                        <Pages currentPageNo={props.currentPageNo} handlePageClick={handlePageClick}/>
                        <li className={"page-item" + (props.currentPageNo == noOfPages - 1 ? " disabled" : "")}>
                        <a className="page-link" href="#" aria-label="Next" onClick={() => handleNextPageClick()}>
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </a>
                        </li>
                    </ul>
                    <p>Showing {props.currentPageNo * 10 + 1} - {props.currentPageNo != noOfPages - 1? props.currentPageNo * 10 + 10 : noOfGames} of {noOfGames} results</p>
                </nav>
                }
                <h4>Search results:</h4>
                <table className="table">
                    <TableHeader />
                    <TableBody handleRemoveGameFromWishlist={props.handleRemoveGameFromWishlist} handleAddGameToWishList={props.handleAddGameToWishList} handleCopy={props.handleCopy} loggedIn={props.loggedIn} user={props.user} games={props.currentPageGames} sortBy={props.sortBy} stores={props.stores} deals={props.deals} priceRange={props.priceRange} storeFilter={props.storeFilter} onSale={props.onSale}/>
                    {//!props.pageIsClicked && <TableBody handleRemoveGameFromWishlist={props.handleRemoveGameFromWishlist} handleAddGameToWishList={props.handleAddGameToWishList} loggedIn={props.loggedIn} user={props.user} games={currentPage} sortBy={props.sortBy} stores={props.stores} deals={props.deals} priceRange={props.priceRange} storeFilter={props.storeFilter} onSale={props.onSale}/>
                    }
                </table>
            </div>
        )
    }else if(props.isLoading || !props.searchBtnClicked || props.search == ''){
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
                <th>Cheapest Deal Store</th>
                <th>Cheapest Sale Price</th>
                <th>Retail Price</th>
                <th>Saved Amounts</th>
                <th>Wishlist</th>
                <th>Share</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    const clickHandler = (g) =>{
        let temp = {}
        temp["date"] = new Date().setHours(0,0,0,0);
        temp["views"] = 1;
        console.log(temp)
        fetch(`http://localhost:8080/api/db/updateGameView/${g}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(temp)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else
                    throw Error("HTTP 404, Not Found");
            }).then((json) => {

            }).catch((err) => {
                console.log("ERROR" + err)
            })
        
}
    var games = [...props.games];
    switch(props.sortBy){
        case "1":
            games.sort((a, b) => (a.external > b.external) ? 1 : (a.external < b.external) ? -1 : 0);
            break;
        case "2":
            games.sort((a, b) =>{
                return(a.cheapest - b.cheapest);
            })
            break;
        case "3":
            //var temp;
            games.sort((a, b) => {
                let deal1, deal2;
                for (let i = 0; i < props.deals.length; ++i){
                    if (a.gameID == props.deals[i].gameInfo.gameID){
                        deal1 = props.deals[i];
                    }
                    if (b.gameID == props.deals[i].gameInfo.gameID){
                        deal2 = props.deals[i];
                    }
                }
                if (deal1 && deal2)
                    return (deal1.gameInfo.retailPrice - deal2.gameInfo.retailPrice);
                //else 
                    //return 0;
            });
            break;
        case "4":
            
            games.sort((a, b) =>{
                let deal1, deal2;
                for (let i = 0; i < props.deals.length; ++i){
                    if (a.gameID === props.deals[i].gameInfo.gameID){
                        deal1 = props.deals[i];
                    }
                    if (b.gameID === props.deals[i].gameInfo.gameID){
                        deal2 = props.deals[i];
                    }
                }
                if (deal1 && deal2)
                    return ((deal1.gameInfo.salePrice - deal1.gameInfo.retailPrice) / deal1.gameInfo.retailPrice > (deal2.gameInfo.salePrice - deal2.gameInfo.retailPrice) / deal2.gameInfo.retailPrice) ? 1 : -1;
                else 
                    return 0;
            })
            break;
        case "0":
            break;
    }
    //console.log("No of Games: " + games.length);
    const rows = games.map((game, index)=>{
        var store = {};
        var deal = {};
        //console.log(props.onSale);
        for (let i = 0; i < props.deals.length; ++i){
            
            if (game.gameID === props.deals[i].gameInfo.gameID){
                //console.log(props.deals);
                deal = props.deals[i];
                for (let j = 0; j < props.stores.length; ++j){
                    if (deal.gameInfo.storeID === props.stores[j].storeID){
                        store = props.stores[j];
                        //console.log(props.storeFilter);
                        var inFilter = false;
                        
                        for (let k = 0; k < props.storeFilter.length; ++k){
                            //console.log(props.storeFilter[k].value)
                            if (store.storeName == props.storeFilter[k].label){
                                inFilter = true;
                            }
                        }

                        if ((deal.gameInfo.salePrice > props.priceRange[0] && deal.gameInfo.salePrice < props.priceRange[1]) && (inFilter || props.storeFilter.length == 0) && (!props.onSale || deal.gameInfo.salePrice < deal.gameInfo.retailPrice))
                        {   
                                                                              
                            return (<TableRow handleLinkClick={clickHandler} handleRemoveGameFromWishlist={props.handleRemoveGameFromWishlist} handleAddGameToWishList={props.handleAddGameToWishList} handleCopy ={props.handleCopy} loggedIn={props.loggedIn} user={props.user} game={game} key={index} store={store} deal={deal} onSale={props.onSale}/>)
                        }
                    }
                }
                break;
            }
        }
    })
    return (
        <tbody>
            {rows}
        </tbody>
    )
}

const TableRow = (props) =>{
    const g = props.game;
    //console.log(g);
    fetch("http://localhost:8080/api/db/update", {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify(g)
    }).then(response =>{
        if (response.ok){
            return response.json();
        }
        else if (response.status === 404){
            throw Error("HTTP 404, Not Found");
        } else {
            throw Error(`HTTP ${response.status}, ${response.statusText}`);
        }
    })
    .then(res => {
        //console.log(res);
    }).catch(err => 
        {});//console.log(err)).catch(err => console.log(err));

    const notifyAdd = (gameObj) => {
        toast.success(
            <div className="media">
                <img src={gameObj.thumb} className="align-self-center mr-3" width={40} height={40}></img>
                <p className="media-body">{gameObj.name} has been added to your wishlist.</p>
            </div>);
    }
    const notifyRemoved = (gameObj) => {
        toast.error(
            <div className="media">
                <img src={gameObj.thumb} className="align-self-center mr-3" width={40} height={40}></img>
                <p className="media-body">{gameObj.name} has been removed from your wishlist.</p>
            </div>);
    }
    
    const handleAddGameToWishList = (gameObj) => {
        var heart = document.getElementById('heart' + gameObj.gameID);
        heart.classList.remove("fa-heart-o");
        heart.classList.add("fa-heart");
        console.log(gameObj);
        props.handleAddGameToWishList(gameObj);
        notifyAdd(gameObj);
    }

    const handleRemoveGameFromWishlist = (gameObj) => {
        var heart = document.getElementById('heart' + gameObj.gameID);
        heart.classList.remove("fa-heart");
        heart.classList.add("fa-heart-o");
        props.handleRemoveGameFromWishlist(gameObj);
        notifyRemoved(gameObj);
    }

    let flag = false;
    let isInWishlist = false;
    let save = 0;
    if (props.deal.gameInfo){
        flag = true;
        save = -(props.deal.gameInfo.salePrice - props.deal.gameInfo.retailPrice) / props.deal.gameInfo.retailPrice * 100;
    }
    if(props.loggedIn && props.user){
        for(let i = 0; i < props.user.wishlistedGames.length; ++i){
            if (props.user.wishlistedGames[i].gameID == g.gameID)
                isInWishlist = true;
        }
    }
    const popover = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Wanna follow this game?</Popover.Title>
          <Popover.Content>
            <a href="#exampleInputEmail1">Log in</a> or <Link to='register'>create an account</Link> now to receive price alert
          </Popover.Content>
        </Popover>
    );

    if (flag){
        return(
            <tr>
                <td><Link to={`/game-detail/${g.gameID}`} onClick={()=>props.handleLinkClick(g.gameID)}><img src={g.thumb} width={40} height={40}/></Link></td>
                <td><Link to={`/game-detail/${g.gameID}`} onClick={()=>props.handleLinkClick(g.gameID)}>{g.external}</Link></td>
                <td>
                    <a href={`https://www.cheapshark.com/redirect?dealID=${g.cheapestDealID}`}>{props.store.storeName}</a>

                </td>
                <td>{props.deal.gameInfo.salePrice}$</td>
                <td>{props.deal.gameInfo.retailPrice}$</td>
                <td>{save.toFixed(2)}% ({-(props.deal.gameInfo.retailPrice - props.deal.gameInfo.salePrice).toFixed(2)}$)</td>
                <td>
                    {!props.loggedIn &&
                        <OverlayTrigger trigger="click" placement="right" overlay={popover} delay={{ show: "250", hide: "400" }}>
                            <i class="fa fa-heart-o"></i>
                        </OverlayTrigger>
                    }
                    {(props.loggedIn && !isInWishlist) &&
                    <i class="fa fa-heart-o" id={"heart"+g.gameID} onClick={() => handleAddGameToWishList(props.deal.gameInfo)}></i>}
                    {(props.loggedIn && isInWishlist) &&
                    <i class="fa fa-heart" id={"heart"+g.gameID} onClick={() => handleRemoveGameFromWishlist(props.deal.gameInfo)}></i>}
                </td>
                    <td class="share-cell">
                        <TwitterShareButton
                            url={window.location.href + "game-detail/" + g.gameID}
                            title={"Check out this amazing deal on " + props.deal.gameInfo.name + ": "}
                            >
                            <TwitterIcon
                            size={30}
                            round />
                        </TwitterShareButton>
                        <FacebookShareButton
                            // url={window.location.href + "game-detail/" + g.gameID}
                            url="www.google.ca"
                            quote={"Check out this amazing deal on " + props.deal.gameInfo.name + ": " + window.location.href + "game-detail/" + g.gameID}
                            >
                            <FacebookIcon
                            size={30}
                            round />
                        </FacebookShareButton>
                        <button type="button" class="btn btn-default btn-circle" onClick={()=>props.handleCopy(g)}><i class="fa fa-copy"></i></button>
                    </td>
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