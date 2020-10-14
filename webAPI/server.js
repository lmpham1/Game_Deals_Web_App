const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const session = require('express-session');
const passport = require('passport');
const HTTP_PORT = process.env.PORT || 8080;
const fetch = require("node-fetch");
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

const manager = require("./manager.js");
const m = manager();

m.initizalizePass(passport);

// ################################################################################
// Deliver the app's home page to browser clients

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
  });
  
app.get('/api', (req,res) => {
  let links = [
    { 
      method: "GET",
      link: "/api/users",
      function: "Get All Users"
    },
    {
      method: "GET",
      link: "/api/user/id/:id",
      function: "Get One User By Id"
    },
    {
      method: "GET",
      link: "/api/user/username/:name",
      function: "Get One User By Username"
    },
    {
      method: "POST",
      link: "/api/users",
      function: "Add New User"
    },
    {
      method: "PUT",
      link: "/api/user/:id",
      function: "Update Existing User"
    },
    {
      method: "DELETE",
      link: "/api/user/:id",
      function: "Delete User"
    }
  ]
  res.json(links);
})

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())


/**************************
 * Users related requests *
 **************************/

// Get all users
app.get('/api/users', (req, res) =>{
  m.userGetAll()
  .then(data => res.status(200).json(data))
  .catch(err => res.status(500).json({message: err}));
})

//Get user by _id
app.get('/api/user/id/:id', (req, res)=>{
  m.userGetById(req.params.id)
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({message: err}));
})

//Get user by username
app.get('/api/user/username/:name', (req, res)=>{
  m.userGetByUsername(req.params.name)
  .then(data => res.status(200).json(data))
  .catch(err=> res.status(500).json({message: err}));
})

//Update user
app.put('/api/user/:id', (req, res) => {
  console.log(req.body);
  m.userUpdate(req.params.id, req.body)
  .then(data=> res.status(201).json(data))
  .catch(err=> res.status(500).json({message: err}));
})

//Delete user
app.delete('/api/user/:id', (req, res) =>{
  m.userDelete(req.params.id)
  .then(message => res.status(201).send(message))
  .catch(err => res.status(500).send(err));
})

//Create user
app.post('/api/users', (req,res) => {
  console.log(req.body);
  m.userAdd(req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

//login user
app.post('/api/login', (req, res, next) =>{  
  passport.authenticate('local' , function(err, user, info){    
if(err){ return res.json(err);}
if (!user) { return res.json("No user found")}
req.logIn(user, function(err){
  console.log(err + "TIL HEEEEREEEE");
  if (err) { res.json("Wrong password!" ) ;}
  return res.json("Logged in successfuly!");
});
  })(req, res, next);  
})

/**************************
 * Cheapshark API Fetches *
 **************************/

 //Fetch single game based on gameID
app.get('/api/game/:gameid', (req, res)=>{
  var gameUrl = "https://www.cheapshark.com/api/1.0/games?id=" + req.params.gameid;
  fetch(gameUrl)
  .then(res => res.json())
  .then(data => res.json(data))
  .catch(error => console.log('error', error));
});

//Fetch game list based on search term
app.get('/api/search/:searchTerm', (req, res)=>{
  var searchUrl = "https://www.cheapshark.com/api/1.0/games?title=" + req.params.searchTerm;
  fetch(searchUrl)
  .then(res => res.json())
  .then(data => res.json(data))
  .catch(error => console.log('error', error));
})

//Fetch store list (Not sure if we need this)
app.get('/api/stores', (req, res)=>{
  fetch('https://www.cheapshark.com/api/1.0/stores')
  .then(res => res.json())
  .then(data => res.json(data))
  .catch(error => console.log('error', error));
})

app.get('/api/store/:id', (req, res)=>{
  fetch('https://www.cheapshark.com/api/1.0/stores')
  .then(dat => dat.json())
  .then(data => {
    for (var i = 0; i < data.length; ++i){
      if (data[i].storeID == req.params.id){
        return res.json(data[i]);
      }
    }
    return res.json({message: "Data Not Found"});
  }).catch(error => console.log('error', error));
})

app.get('/api/deal/:id', (req, res)=>{
  fetch(`https://www.cheapshark.com/api/1.0/deals?id=${req.params.id}`)
  .then(dat => dat.json())
  .then(data =>{
    res.json(data);
  }).catch(error => console.log('error', error));
})

app.use((req, res) => {
    res.status(404).send("Resource not found");
});
// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect().then(() => {
    app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
  })
    .catch((err) => {
      console.log("Unable to start the server:\n" + err);
      process.exit();
    });