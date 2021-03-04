const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const session = require('express-session');
const passport = require('passport');
const cookieParser = require("cookie-parser");
const HTTP_PORT = process.env.PORT || 8080;
const fetch = require("node-fetch");
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

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
app.use(cookieParser("secret"));
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

app.put('/api/addGame/:id', (req, res) => {
  console.log("here!")
  console.log(req.body);
  m.addGame(req.params.id, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

// add game to the stack
app.put('/api/history/push/:id', (req, res) => {
  m.pushGameToHistory(req.params.id, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/history/pop/:id', (req, res) => {
  m.popGameFromHistory(req.params.id, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

//Saves theme
app.put('/api/updateTheme/:id', (req, res) => {
  console.log("This is passed: " + req.body.theme);
  m.updateTheme(req.params.id, req.body.theme)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
    res.status(500).json({"message":error});
  })
})

// display all games in search history
app.get('/api/history/:id', (req, res) => {
  m.getHistory(req.params.id)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.post('/api/addComment/:id', (req, res) => {
  m.pushComment(req.params.id, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/removeComment/:gameId/:commentId', (req, res) => {
  m.popComment(req.params.gameId, req.params.commentId)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})
//app.put('/api/likeComment/:commentId/:gameId/:userId', (req, res) => {
app.put('/api/likeComment', (req, res) => {
  m.likeComment(req.query.commentId, req.query.gameId, req.query.userId)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/unLikeComment', (req, res) => {
  m.unlikeComment(req.query.commentId, req.query.gameId, req.query.userId)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/dislikeComment', (req, res) => {
  m.dislikeComment(req.query.commentId, req.query.gameId, req.query.userId)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/unDislikeComment', (req, res) => {
  m.unDislikeComment(req.query.commentId, req.query.gameId, req.query.userId)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/removeGame/:id', (req, res) => {
  m.removeGame(req.params.id, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
})

app.put('/api/addPrice/:id/:price', (req, res) => {
  m.addPriceToBeNotified(req.params.id, req.params.price, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  
  })
})

app.put('/api/updateNotif/:id/:state', (req, res) => {
  m.updateNotif(req.params.id, req.params.state, req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
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
if (!user) { return res.json("Wrong Credentials")}
req.logIn(user, function(err){
  console.log(err + "TIL HEEEEREEEE");
  if (err) { res.json("No matching!") ;}
  return res.send(user);
});
  })(req, res, next);  
})

app.get('/api/logout', (req, res)=>{
  console.log("here");
  req.logOut();
  console.log(res.user);
  res.send(res.user);
});

/**************************
 * Cheapshark API Fetches *
 **************************/

 //Fetch single game based on gameID
app.get('/api/game/:gameid', (req, res)=>{
  m.findGameById(req.params.gameid)
  .then(data => res.json(data))
  .catch(error => console.log('error', error));
  /*
  var gameUrl = "https://www.cheapshark.com/api/1.0/games?id=" + req.params.gameid;
  fetch(gameUrl)
  .then(res => res.json())
  .then(data => res.json(data))
  .catch(error => console.log('error', error));*/
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

app.get('/user', (req, res)=>{
  res.send(req.user);
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