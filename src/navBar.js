
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
            console.log(res);
            console.log("loggedIn STATE>>>>>    " + this.state.loggedIn);
            //On break do this only once and store the value.
        });
    }

    render() {
        const login = () => {
            Axios({
                method: "POST",
                data: {
                    userName: this.state.loginUsername,
                    password: this.state.loginPassword,
                },
                withCredentials: true,
                url: "http://localhost:8080/api/login",
            }).then((res) => {
                console.log(res.data)
                if (res.data.userName) {
                    console.log(this.props.state)

                    this.setState({ data: res.data });
                    //this.setState(this.state);
                    this.setState({ loggedIn: true });
                    window.location.reload(false);
                    this.props.handleLogin();
                    //this.props.history.push("/");
                }
                else {
                    window.$('#collapseExample').collapse("show")
                    setTimeout(function () {
                        window.$('#collapseExample').collapse("hide")
                    }, 4000);

                }
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
            <nav class="navbar navbar-expand-lg">
                <a class="navbar-brand" href="/">Game Deals</a>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <Link to='/'>Home</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='about'>About</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='register'>Register</Link>
                        </li>
                    </ul>
                </div>
                {this.state.loggedIn == true ?
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Settings
                    </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Link to="/wishlist"> <a class="dropdown-item" href="#">Wishlist</a></Link>
                            <Link to="/history"> <a class="dropdown-item" href="#">History</a></Link>
                            <Link to="/"><button class="dropdown-item logout" type="button" onClick={logOut} href="#">Logout</button></Link>
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
                    </form>
                }

            </nav>
        )
    }
}

export default withRouter(NavBar);