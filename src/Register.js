import React from 'react'
import { withRouter } from 'react-router-dom'
import './App.css';

class Register extends React.Component {
    //Might have to create state and store each field. Also create onChange to update states
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            fname: '',
            lname: '',
            email: '',
            pw: '',
            pw2: '',
            usernameTaken: false,
            redirect: this.props.redirect
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    //Updates state when it changes
    handleChange(e){
        if (e.target.name == "pw" || e.target.name == "pw2"){
            this.checkMatch();
        }
        this.setState({[e.target.name]: e.target.value});
    }

    //Makes api call on submission    https://mighty-beyond-32231.herokuapp.com/api/users
    handleSubmit(e){
        e.preventDefault();
        console.log("Handle Submit function called");
        fetch(`http://localhost:8080/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ 
                userName: this.state.username,
                fName: this.state.fname,
                lName: this.state.lname,
                email: this.state.email,
                password: this.state.pw
            })
        }).then(res => {
            console.log(res);
            if (res.status == 201){
                console.log("Account successfully created!");
                this.setState({usernameTaken: false});

                this.props.history.push({
                    pathname: '/',
                    state: {redirect: true}
                });
            }
            else if (res.status == 210){
                console.log("Username is already taken");
                this.setState({usernameTaken: true});
            }
        })
        .catch(error=> {console.log(error);})
    }
    
    //Validates password matching and conditionally displays m
    checkMatch() {
        console.log("Check Match Called");
        if (document.getElementById('pw').value == document.getElementById('pw2').value && document.getElementById('pw').value != ""){
            document.getElementById('msg').style.color='green';
            document.getElementById('msg').innerHTML = 'Passwords Match!'
            document.getElementById('form-submit-btn').disabled = false;
        }
        else if (document.getElementById('pw').value != document.getElementById('pw2').value) {
            document.getElementById('msg').style.color='red';
            document.getElementById('msg').innerHTML = 'Passwords do not match!'
            document.getElementById('form-submit-btn').disabled = true;
        }
        else {
            document.getElementById('msg').innerHTML = '';
        }
    }
    
    render() {
        const {username} = this.state;
        return (
            <div className="main-container">
                <h1>Account Registration </h1>        
                <form className="form-horizontal form-register" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="control-label col-sm-4" htmlfor="username">Username:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="username" onChange={this.handleChange} required/>
                            {this.state.usernameTaken ? 
                                <span id="error-text">Username is already taken!</span>
                                :
                                <span></span>
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-4" htmlfor="fname">First Name:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name ="fname" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-4" htmlfor="lname">Last Name:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="lname" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-4" htmlfor="email">Email:</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" name="email" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-4" htmlfor="pw">Password:</label>
                        <div className="col-sm-10">
                         <input type="password" className="form-control" id="pw" name="pw" onChange={this.handleChange}  required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-4" htmlfor="pw2">Confirm Password:</label>
                        <div className="col-sm-10">
                         <input type="password" className="form-control" id="pw2" name="pw2" onChange={this.handleChange} required/>
                         <span id="msg"></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-success btn-center" id="form-submit-btn" disabled required>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(Register)