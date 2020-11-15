import React, { Component, useState } from "react";
import { Switch, Route, Link, Redirect, withRouter } from "react-router-dom";
import $ from 'jquery';
import Axios from 'axios';
import './App.css';

class NavBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false,
            loginUsername: "",
            loginPassword: "",
            data: null,
            isOpen: false
        }
        console.log("This")
        console.log(props)
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
            console.log(res.data);
            console.log("loggedIn STATE>>>>>    " + this.state.loggedIn);
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
                    this.setState({ data: res.data })
                    this.props.history.push("/")
                }
            });
        };

        const logOut = () => {
            Axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/logout",
            }).then((res) => {
                this.setState({ loggedIn: false });
                this.forceUpdate();
            });
        };
        return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="/">Game Deals</a>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <Link to='/'>Home</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='/game'>Game</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='about'>About</Link>
                        </li>
                    </ul>
                </div>
                <div>

                </div>
                {this.state.loggedIn == true ?
                    <Link to='/login'>
                        <button type="button" onClick={logOut} class="btn btn-success">Logout</button>
                    </Link>
                    :
                    <button type="button" class="btn btn-primary" onClick={() => this.setState({ isOpen: true })} data-toggle="modal" data-target="#exampleModal">
                        LogIn
                  </button>
                }















                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                <div>
                                    <form>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Email address</label>
                                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                placeholder="username" onChange={(e) => this.setState({ loginUsername: e.target.value })}></input>
                                        </div>

                                        <div class="form-group">
                                            <label for="exampleInputPassword1">Password</label>
                                            <input type="password" class="form-control" id="exampleInputPassword1"
                                                placeholder="password"
                                                onChange={(e) => this.setState({ loginPassword: e.target.value })}></input>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" onClick={() => login()} class="btn btn-primary" >Login</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <ul class="navbar-nav navbar-right">
                        <li class="nav-item">

                            {this.state.loggedIn == true ?
                                <Link to='/login'>
                                    <button type="button" onClick={logOut} class="btn btn-success">Logout</button>
                                </Link>

                                :
                                <Link to='/login'>
                                    <button type="button" class="btn btn-success">Login</button>
                                </Link>
                            }

                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter(NavBar);