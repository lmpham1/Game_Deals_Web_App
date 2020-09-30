const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

const manager = require("./manager.js");
const m = manager();

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

/*

//Get all games
app.get('/api/games', (req, res)=>{
  m.gameGetAll()
  .then(data=> res.status(200).json(data))
  .catch(err => res.status(404).json({message: err}))
})

//Get a game by name
app.get('/api/game/name/:name', (req, res)=>{
  m.gameGetByName(req.params.name)
  .then(data => res.json(data))
  .catch(err => res.status(404).json({message: err}));
})

//Create game
app.post('/api/games', (req,res) => {
  m.gameAdd(req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})
*/

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