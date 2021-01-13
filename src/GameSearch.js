import React, { Component } from "react";
import {Link, withRouter, Redirect} from "react-router-dom";
import Slider from '@material-ui/core/Slider';
import MultiSelect from "react-multi-select-component";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
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

        /* Pagination Logic (Not Working)
        this.handlePageClick = this.handlePageClick.bind(this);
        this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnPrevClick = this.btnPrevClick.bind(this);
        this.btnNextClick = this.btnNextClick.bind(this);
        */

        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleSaveFilter = this.handleSaveFilter.bind(this);
        this.handleOpenFilter = this.handleOpenFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
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
        
        gamesPerPage: 10,
        currentPage: 1,
        upperPageBound: 3,
        lowerPageBound: 0,
        isPrevBtnActive: 'disable',
        isNextBtnActive: '',
        pageBound: 3,

        showFilter: false,
        saveChangesClicked: false
    };

    //handle Search String Changes
    handleChange(e) {
        this.setState({ search: e.target.value.replace(/\s/g, '%20') });
    }
    
    //handle Search Button Click
    handleSearch(e) {
        //console.log(e.target.value);

        this.setState({games: [], deals: [], isLoading: true, isEmpty: true, searchBtnClicked: true});
        
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
                //console.log(responseData);
                
                this.setState({ games: responseData});
                if (this.state.games.length > 0){
                    this.setState({ isEmpty: false});
                }
                //console.log(this.state.games);

                //fetch deals
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
    
    componentDidMount(){
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

    /* Pagination Logic (Not Working)
    componentDidUpdate(){
        $("ul li.active").removeClass('active');
        $('ul li#'+this.state.currentPage).addClass('active');
    }

    handlePageClick(event) {
        let listid = Number(event.target.id);
        this.setState({
          currentPage: listid
        });
        $("ul li.active").removeClass('active');
        $('ul li#'+listid).addClass('active');
        this.setPrevAndNextBtnClass(listid);
    }

    setPrevAndNextBtnClass(listid) {
        let totalPage = Math.ceil(this.state.games.length / this.state.gamesPerPage);
        this.setState({isNextBtnActive: 'disable'});
        this.setState({isPrevBtnActive: 'disable' });
        if(totalPage === listid && totalPage > 1){
            this.setState({isPrevBtnActive: ''});
        }
        else if(listid === 1 && totalPage > 1){
            this.setState({isNextBtnActive: ''});
        }
        else if(totalPage > 1){
            this.setState({isNextBtnActive: ''});
            this.setState({isPrevBtnActive: ''});
        }
    }

    btnIncrementClick() {
        this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid});
        this.setPrevAndNextBtnClass(listid);
    }

    btnDecrementClick() {
        this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid});
        this.setPrevAndNextBtnClass(listid);
    }

    btnPrevClick() {
        if((this.state.currentPage -1)%this.state.pageBound === 0 ){
            this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage : listid});
        this.setPrevAndNextBtnClass(listid);
    }

    btnNextClick() {
        if((this.state.currentPage +1) > this.state.upperPageBound ){
            this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage : listid});
        this.setPrevAndNextBtnClass(listid);
    }
    */

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

    render(){
        document.title = "Search results for \"" + this.state.search + "\""

        let loading;
        if (this.state.isLoading){
            loading = <p>Your result is loading...</p>
        }
        else loading = <></>;

        /* Page Numbering

        const indexOfLastGame = this.state.currentPage * this.state.gamesPerPage;
        const indexOfFirstGame = indexOfLastGame - this.state.gamesPerPage;
        const currentGames = this.state.games.slice(indexOfFirstGame, indexOfLastGame);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.games.length / this.state.gamesPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            if(number === 1 && this.state.currentPage === 1){
                return(
                    <li key={number} className='active' id={number}><a href='#' id={number} onClick={this.handlePageClick}>{number}</a></li>
                )
            }
            else if((number < this.state.upperPageBound + 1) && number > this.state.lowerPageBound){
                return(
                    <li key={number} id={number}><a href='#' id={number} onClick={this.handlePageClick}>{number}</a></li>
                )
            }
        });

        let pageIncrementBtn = null;
        if(pageNumbers.length > this.state.upperPageBound){
            pageIncrementBtn = <li className=''><a href='#' onClick={this.btnIncrementClick}> &hellip; </a></li>
        }
        let pageDecrementBtn = null;
        if(this.state.lowerPageBound >= 1){
            pageDecrementBtn = <li className=''><a href='#' onClick={this.btnDecrementClick}> &hellip; </a></li>
        }
        let renderPrevBtn = null;
        if(this.state.isPrevBtnActive === 'disabled') {
            renderPrevBtn = <li className={this.state.isPrevBtnActive}><span id="btnPrev"> Prev </span></li>
        }
        else{
            renderPrevBtn = <li className={this.state.isPrevBtnActive}><a href='#' id="btnPrev" onClick={this.btnPrevClick}> Prev </a></li>
        }
        let renderNextBtn = null;
        if(this.state.isNextBtnActive === 'disabled') {
            renderNextBtn = <li className={this.state.isNextBtnActive + "btn-secondary"}><span id="btnNext"> Next </span></li>
        }
        else{
            renderNextBtn = <li className={this.state.isNextBtnActive}><a href='#' id="btnNext" onClick={this.btnNextClick}> Next </a></li>
        }
        */

        return(
            <div>
                <div className="form-inline d-flex md-form form-sm mt-0 justify-content-center mb-2">
                        <input className="form-control-sm" style={{width: "93%"}} value={this.state.search.replaceAll('%20', ' ')} type="text" placeholder="Search for a game title" aria-label="Search" name="search" onChange={this.handleChange}/>
                        <input type="submit" className="fas fa-search ml-2" value="Search" onClick={this.handleSearch}/>
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
                <DisplayContent searchBtnClicked={this.state.searchBtnClicked} priceRange={this.state.priceRange} sortBy={this.state.sortBy} search={this.state.search.replaceAll('%20', ' ')} storeFilter={this.state.storeFilter} onSale={this.state.onSaleFilter} isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} games={this.state.games} stores={this.state.stores} deals={this.state.deals}/>
                {/*
                <ul id="page-numbers" className="pagination">
                  {renderPrevBtn}
                  {pageDecrementBtn}
                  {renderPageNumbers}
                  {pageIncrementBtn}
                  {renderNextBtn}
                </ul>
                */}
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

const DisplayContent = (props) => {
    if (!props.isEmpty){
        return( 
            <div className="mt-3">
                <h4>Search results:</h4>
                <table className="table table-striped">
                    <TableHeader />

                    <TableBody games={props.games} sortBy={props.sortBy} stores={props.stores} deals={props.deals} priceRange={props.priceRange} storeFilter={props.storeFilter} onSale={props.onSale}/>
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
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
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
    //console.log(indexToBeRemoved);
    for(let i = indexToBeRemoved.length - 1; i > 0; --i){
        games.splice(indexToBeRemoved[i], 1);
    }
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
                console.log(a.external);
                console.log(deal1);
                console.log(b.external);
                console.log(deal2);
                if (deal1 && deal2)
                    return (deal1.gameInfo.retailPrice - deal2.gameInfo.retailPrice);
                //else 
                    //return 0;
            });
            console.log(games);
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
                            return (<TableRow game={game} key={index} store={store} deal={deal} onSale={props.onSale}/>)
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
    //console.log("gm value");
    //console.log(gm);
    let flag = false;
    let save = 0;
    if (props.deal.gameInfo){
        flag = true;
        save = -(props.deal.gameInfo.salePrice - props.deal.gameInfo.retailPrice) / props.deal.gameInfo.retailPrice * 100;
    }
    if (flag){
        return(
            <tr>
                <td><Link to={`/game-detail/${g.gameID}`}><img src={g.thumb} alt={g.internalName} width={40} height={40}/></Link></td>
                <td><Link to={`/game-detail/${g.gameID}`}>{g.external}</Link></td>
                <td>
                    <a href={`https://www.cheapshark.com/redirect?dealID=${g.cheapestDealID}`}>{props.store.storeName}</a>

                </td>
                <td>{props.deal.gameInfo.salePrice}$</td>
                <td>{props.deal.gameInfo.retailPrice}$</td>
                <td>{save.toFixed(2)}% ({-(props.deal.gameInfo.retailPrice - props.deal.gameInfo.salePrice).toFixed(2)}$)</td>
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