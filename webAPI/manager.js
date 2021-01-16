const mongoose = require('mongoose');

const localStrategy = require('passport-local').Strategy

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//mongoose.set('useUnifiedTopology', true);

const bcrypt = require('bcrypt');

const usersSchema = require('./schema-users');
const gamesSchema = require('./schema-games');

class Wishlist {
    constructor(storeID, gameID, name, salePrice, retailPrice, releaseDate, thumb, priceToBeNotified = null) {
        this.storeID = storeID;
        this.gameID = gameID;
        this.name = name;
        this.salePrice = salePrice;
        this.retailPrice = retailPrice;
        this.releaseDate = releaseDate;
        this.thumb = thumb;
        this.notifSwitch = false;

        if (!priceToBeNotified) {
            this.priceToBeNotified = null;
        }
        else {
            this.priceToBeNotified = priceToBeNotified;
        }
    }
}

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

        
        userAdd: function (newItem) {
            return new Promise(async (resolve, reject) => {
                console.log(newItem.password)
                if (newItem.password) {
                    test = newItem.password
                    salt = await bcrypt.genSalt();
                    newItem.password = await bcrypt.hash(newItem.password, salt);
                    console.log(salt)
                    console.log(newItem.password)
                }
                
                if (bcrypt.compare(newItem.password, test))
                console.log("encrypt worked")
                else
                console.log("encrypt did not work")
                users.create(newItem, (error, item) => {
                    if (error) {
                        return reject(error.message);
                    }
                    console.log(newItem.password)
                    return resolve(item)
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
                games.find({gameId: gameId}, (err, result)=>{
                    if (err)
                        reject(err);
                    else if (!result || result.length == 0)
                        reject(-1);
                    else
                        resolve(result[0]);
                })
            })
        },

        gameAdd: function(newGame) {
            return new Promise((resolve, reject) => {
                games.create({  
                    gameId: newGame.gameID, 
                    gameName: newGame.external
                }, (error, item) => {
                    if (error) {
                        return reject(error.message);
                    }
                    
                    return resolve(item);
                })
            })
        },

        gameUpdate: function(gameId, updatedGame){
            //console.log(updatedGame);
            //console.log(gameId);
            return new Promise((resolve, reject)=>{
                games.findOneAndUpdate(
                    {gameId: gameId},    //filter query
                    {  
                        gameName: updatedGame.external  //properties to be updated, add more properties later here
                    }, (err, result)=>{
                        //console.log(result);
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                })
            })
        },
        
        /*,
        // FOR TESTING PURPOSES
            
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
        }
        */
       
        initizalizePass: function (passport) {
            const authenticateUser = async (username, password, done) => {
                console.log(username)
                var user
                try {
                    console.log('inside try get user')
                    await users.findOne({ userName: username }, async (err, result) => {
                        if (err) {
                            console.log('inside try get user if err' + err)
                            return done(null, false, { message: err });
                            }
                            else if (!result) {
                                console.log('inside try get user user not found')
                                return done(null, false, { message: "no user found!" });
                            }
                            else {
                            console.log('inside try get user user found' + result)
                            user = result;
                            if (!user) {
                                console.log('after finding user if !user')
                                return done(null, false, { message: 'That username is not registered!' })
                            }
                            if (await bcrypt.compare(password, user.password)) {
                                console.log('inside try bcrypt compare')
                                return done(null, user);
                            }
                            else {
                                console.log('inside try bcrypt compare else(wrong pass)')
                                return done(null, { message: "Wrong password!" });
                            }
                            
                        }
                    })
                } catch (error) {
                    console.log('inside catch error' + error)
                    return done(null, false, { message: "no user found!" + error });
                    
                }
            }
            passport.use(new localStrategy({ usernameField: 'userName' }, authenticateUser));
            
            passport.serializeUser((user, done) => {
                console.log('inside serialization' + user)
                done(null, user.id)
            });
            passport.deserializeUser((id, done) => {
                console.log('inside deserialization')
                users.findById(id, function (err, user) {
                    console.log('inside deserialization' + err + user)
                    done(err, user);
                });
            });
        },
        
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
        
        addGame: function(userId, obj) {
            return new Promise((resolve, reject) => {
                users.findById(userId, (err, result) => {
                    if (err){ // error in the database
                        console.log("error");
                        reject (err);
                    }
                    else if (!result) { // if no user is found          
                        console.log("No user")
                        reject("No user found");
                    }
                    else {
                        let found = false;
                        for (let i = 0; i < result.wishlistedGames.length; i++) {
                            if (obj.gameID == result.wishlistedGames[i].gameID) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            //result.wishlistedGames.push(obj);
                            let tmp = new Wishlist(obj.storeID, obj.gameID, obj.name,
                                obj.salePrice, obj.retailPrice, obj.releaseDate, obj.thumb);
                            result.wishlistedGames.push(tmp);
                            users.findByIdAndUpdate(userId, result, { new: true }, (err, result) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            })
                        }
                        else {
                            reject("Game already in wishlist");
                        }

                    }
                })
            })
        },

        addPriceToBeNotified: function(usedId, price, obj) { // /api/addPrice/id/price
            return new Promise((resolve, reject) => {
                users.findById(usedId, (err, result) => {
                    if (err){ // error in the database
                        console.log("error");
                        reject (err);
                    }
                    else if (!result) { // if no user is found          
                        console.log("No user")
                        reject("No user found");
                    }
                    else {
                        for (let i = 0; i < result.wishlistedGames.length; i++) {
                            if (obj.gameID == result.wishlistedGames[i].gameID) {
                                if (price == "" || price == "null"){
                                    result.wishlistedGames[i].priceToBeNotified = null;
                                }
                                else {
                                    result.wishlistedGames[i].priceToBeNotified = price;
                                }

                                 price;
                                users.findByIdAndUpdate(usedId, result, { new: true }, (err, result) => {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve(result);
                                })
                            }
                        }
                    }
                })
            })
        },

        updateNotif: function(usedId, state, obj) {
            return new Promise((resolve, reject) => {
                users.findById(usedId, (err, result) => {
                    if (err){ // error in the database
                        console.log("error");
                        reject (err);
                    }
                    else if (!result) { // if no user is found          
                        console.log("No user")
                        reject("No user found");
                    }
                    else {
                        for (let i = 0; i < result.wishlistedGames.length; i++) {
                            if (obj.gameID == result.wishlistedGames[i].gameID) {
                                if (state == "false"){
                                    result.wishlistedGames[i].notifSwitch = false;
                                }
                                else{
                                    result.wishlistedGames[i].notifSwitch = true;
                                }
                                users.findByIdAndUpdate(usedId, result, { new: true }, (err, result) => {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve(result);
                                })
                            }
                        }
                    }
                })
            })
        },

        removeGame: function(userId, obj) {
            return new Promise((resolve, reject) => {
                users.findById(userId, (err, result) => {
                    if (err){ // error in the database
                        console.log("error");
                        reject (err);
                    }
                    else if (!result) { // if no user is found          
                        console.log("No user")
                        reject("No user found");
                    }
                    else {
                        let found = false;
                        for (let i = 0; i < result.wishlistedGames.length; i++) {
                            if (obj.gameID == result.wishlistedGames[i].gameID) {
                                found = true;
                                break;
                            }
                        }

                        if (found) {
                            result.wishlistedGames.pop(obj);
                            users.findByIdAndUpdate(userId, result, { new: true }, (err, result) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            })
                        }
                        else {
                            reject("Game not in wishlist");
                        }

                    }
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

        userUpdate: function (id, updatedUser) {
            return new Promise(async (resolve, reject) => {
                if (updatedUser.password) {
                    test = updatedUser.password
                    salt = await bcrypt.genSalt();
                    updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
                    console.log(salt)
                    console.log(updatedUser.password)
                }
                users.findByIdAndUpdate(id, updatedUser, { new: true }, (err, result) => {
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