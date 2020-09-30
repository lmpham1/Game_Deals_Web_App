const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);

const usersSchema = require('./schema-users');
const gamesSchema = require('./schema-games');
module.exports = function() {
    let users, games;

    return {
        connect: function() {
            return new Promise((resolve, reject) => {
                console.log("Attempting to connect to the database...");

                // Create connection to the database
                
                let db = mongoose.createConnection('mongodb+srv://btsCapstone:vYYwHBt2kut6WEaw@btscapstone.ddnpq.mongodb.net/Capstone');

                db.on('error', (error) => {
                    console.log('Connection error: ', error.message);
                    reject(error);
                });

                db.once('open', () => {
                    console.log('Connection to the database was successful');
                    users = db.model("Users", usersSchema, "Users");
                    games = db.model("Games", gamesSchema, "Games");
                    resolve();
                })
            })
        },

        // FOR TESTING PURPOSES
        userAdd: function(newItem) {
            return new Promise((resolve, reject) => {
                users.create(newItem, (error, item) => {
                    if (error) {
                        return reject(error.message);
                    }
                    console.log("here")
                    return resolve(item)
                })
            })
        },
        
        /*,
        // FOR TESTING PURPOSES
        gameAdd: function(newGame) {
            return new Promise((resolve, reject) => {
                games.create(newGame, (error, item) => {
                    if (error) {
                        return reject(error.message);
                    }

                    return resolve(item);
                })
            })
        },
        

        gameGetAll: function(){
            return new Promise((resolve, reject) =>{
                games.find({}, (error, results) => {
                    if (error)
                        reject(err);
                    else if (results.length == 0)
                        reject("Fetched failed! The database is empty!");
                    else
                        resolve(results);
                })
            })
        },

        gameGetById: function(gameId){
            return new Promise((resolve, reject)=>{
                games.findById(gameId, (err, result)=>{
                    if (err)
                        reject(err);
                    else if (!result)
                        reject("Game not found!");
                    else
                        resolve(result);
                })
            })
        }
        ,

        gameGetByName: function(name){
            return new Promise((resolve, reject)=>{
                games.find({
                    gameName: { "$regex": name, "$option": "i"}
                },
                (err, results) =>{
                    if (err)
                        reject(err);
                    else if (results.length == 0)
                        reject("No game found!");
                    else
                        resolve(results);
                })
            })
        },

        gameUpdate: function(gameId, updatedGame){
            return new Promise((resolve, reject)=>{
                games.findByIdAndUpdate(gameId, updatedGame,(err, result)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                })
            })
        },
        */

        userGetAll: function(){
            return new Promise((resolve, reject)=>{
                users.find({}, (err, results)=>{
                    if (err)
                        reject(err);
                    else if(results.length == 0)
                        reject("User not found!");
                    else
                        resolve(results);
                })
            })
        },

        userGetById: function(userId){
            return new Promise((resolve, reject)=>{
                users.findById(userId, (err, result)=>{
                    if (err)
                        reject(err);
                    else if (!result)
                        reject("No user found");
                    else resolve(result);
                })
            })
        },

        userGetByUsername: function(username){
            return new Promise((resolve, reject)=>{
                users.findOne({userName: username}, (err, result)=>{
                    if (err)
                        reject(err);
                    else if (!result)
                        reject("User not found");
                    else
                        resolve(result);
                })
            })
        },

        userUpdate: function(id, updatedUser){
            return new Promise((resolve, reject)=>{
                users.findByIdAndUpdate(id, updatedUser, (err, result)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                })
            })
        },

        userDelete: function(id){
            return new Promise((resolve, reject)=>{
                users.findByIdAndDelete(id, err=>{
                    if (err)
                        reject(err);
                    else
                        resolve("User " + id + " deleted!");
                })
            })
        }
        
    }

}