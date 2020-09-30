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
    res.send("Test")
})

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

app.post('/api/games', (req,res) => {
  m.gameAdd(req.body)
  .then((data) => {
    res.status(201).json(data);
  })
  .catch((error) => {
  res.status(500).json({ "message": error });
  })
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