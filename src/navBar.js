
import React, { Component, useState } from "react";
import { Switch, Route, Link, Redirect, withRouter } from "react-router-dom";
import $ from 'jquery';
import Axios from 'axios';
import './App.css';
import Toggle from "react-toggle";


class NavBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            initialState: this.state,
            loggedIn: false,
            loginUsername: "",
            loginPassword: "",
            data: null,
            isOpen: false,
            isLoading: false,
            theme: ""
        }
    }


    componentDidMount() {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/user",
        }).then((res) => {
            if (res.data._id) {
                this.setState({ loggedIn: true });
                this.setState(this.state);
            }
            else {
                this.setState({ loggedIn: false });
                this.setState(this.state);
            }
            //On break do this only once and store the value.
        });
    }

    render() {
        const login = () => {
            this.setState({isLoading: true});
            Axios({
                method: "POST",
                data: {
                    userName: this.state.loginUsername,
                    password: this.state.loginPassword,
                },
                withCredentials: true,
                url: "http://localhost:8080/api/login",
            }).then((res) => {
                if (res.data.userName) {

                    this.setState({ data: res.data });
                    this.setState({ loggedIn: true });
                    window.location.reload(false);
                    this.props.handleLogin();
                }
                else {
                    window.$('#collapseExample').collapse("show")
                    setTimeout(function () {
                        window.$('#collapseExample').collapse("hide")
                    }, 4000);

                }
                this.setState({isLoading: false});
            });
        };

        const logOut = () => {
            Axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/logout",
            }).then((res) => {
                this.setState({ loginUsername: "" });
                this.setState({ loggedIn: false });
                window.location.reload(false);
                this.props.handleLogout();
                //this.forceUpdate();
            });
        };
        
        return (
            <nav class="navbar navbar-expand-lg sticky-top">
                <a class="navbar-brand" href="/">Game Deals</a>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <Link to='/'>Home</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='about'>About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='search'>Search</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='register'>Register</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='/viewList'>Top Views</Link>
                        </li>
                    </ul>
                </div>
                <div>

                </div>
                {this.state.isLoading ?
                    <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                    </div>
                    :
                    (this.state.loggedIn == true ?
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                "Settings"
                        </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Link to="/"><button class="dropdown-item" type="button" onClick={logOut} href="#">Logout</button></Link>
                                <Link to="/wishlist"> <a class="dropdown-item" href="#">Wishlist</a></Link>
                                <Link to="/history"> <a class="dropdown-item" href="#">History</a></Link>
                            </div>
                        </div>

                        :
                        <form class="form-inline">
                            <div class="form-group">
                                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                    placeholder="username" onChange={(e) => this.setState({ loginUsername: e.target.value })}></input>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="exampleInputPassword1"
                                    placeholder="password"
                                    onChange={(e) => this.setState({ loginPassword: e.target.value })}></input>
                            </div>
                            <button type="button" onClick={login} class="btn btn-primary" href="#collapseExample">Login</button>
                            <div class="collapse" id="collapseExample">
                                <div class="card card-body">
                                    <p class="text-danger">Wrong Credentials!</p>

                                </div>
                            </div>
                        </form>)
                }

            </nav>
        )
    }
}

export default withRouter(NavBar);