
import React, { Component, useState } from "react";
import Axios from 'axios';
import './App.css';

class LoginUser extends React.Component {
    constructor(props){
        super(props)
        this.state={
            data: null
        }  
        console.log("This") 
        console.log(props)    
    }
    getUser = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/user",
        }).then((res) => {
            this.setState({data : res.data.email});
            console.log(res.data);
            console.log("11111111111111111");
        });
    }; 
   // const [data, setData] = useState(null);
    componentDidMount(){
        this.getUser();
    }
    render() {
        const logOut = () => {
             Axios({
                 method: "GET",
                 withCredentials: true,
                 url: "http://localhost:8080/api/logout",
             }).then((res) => {
                 this.setState({data : null});
                 console.log(res.data);
                 this.getUser();
             });
         }; 
        return (
            <div>                
                <div>
                {this.state.data ? <div> 
                <h1>Welcome Back {this.state.data}, Your login was successful!</h1> 
                <button onClick={logOut} class="btn btn-primary">LogoutTest</button>
                </div>
                : 
                <p>There is no one logged in...</p>
                }                    
                </div>
            </div>
        )
    }
}

export default LoginUser;