const mongoose = require('mongoose');

const localStrategy = require('passport-local').Strategy

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//mongoose.set('useUnifiedTopology', true);

const bcrypt = require('bcrypt');
const fetch = require("node-fetch");


const usersSchema = require('./schema-users');
const gamesSchema = require('./schema-games');

class Wishlist {
    constructor(storeID, gameID, name, salePrice, retailPrice, releaseDate, thumb, priceToBeNotified = null, date = new Date()) {
        this.storeID = storeID;
        this.gameID = gameID;
        this.name = name;
        this.salePrice = salePrice;
        this.retailPrice = retailPrice;
        this.releaseDate = releaseDate;
        this.thumb = thumb;
        this.notifSwitch = false;
        this.date = date;

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
                if (newItem.password) {
                    test = newItem.password
                    salt = await bcrypt.genSalt();
                    newItem.password = await bcrypt.hash(newItem.password, salt);
                }
                
                users.create(newItem, (error, item) => {
                    if (error) {
                        return reject(error.message);
                    }
                    return resolve(item)
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
            return new Promise((resolve, reject)=>{	
                games.findOneAndUpdate(	
                    {gameId: gameId},    //filter query	
                    {  	
                        gameName: updatedGame.external  //properties to be updated, add more properties later here	
                    }, (err, result)=>{	
                        if (err)	
                            reject(err);	
                        else
                            resolve(result);
                    })
                })
        },
               
        initizalizePass: function (passport) {
            const authenticateUser = async (username, password, done) => {
                var user
                try {
                    await users.findOne({ userName: username }, async (err, result) => {
                        if (err) {
                            return done(null, false, { message: err });
                        }
                        else if (!result) {
                            return done(null, false, { message: "no user found!" });
                        }
                        else {
                            user = result;
                            if (!user) {
                                return done(null, false, { message: 'That username is not registered!' })
                            }
                            if (await bcrypt.compare(password, user.password)) {
                                return done(null, user);
                            }
                            else {
                                return done(null, { message: "Wrong password!" });
                            }
                            
                        }
                    })
                } catch (error) {
                    return done(null, false, { message: "no user found!" + error });
                    
                }
            }
            passport.use(new localStrategy({ usernameField: 'userName' }, authenticateUser));
            
            passport.serializeUser((user, done) => {
                done(null, user.id)
            });

            passport.deserializeUser((id, done) => {
                users.findById(id, function (err, user) {
                    //console.log('inside deserialization' + err + user)
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
                                index = i;
                                break;
                            }
                        }

                        if (found) {
                            //result.wishlistedGames.pop(obj); //! DOESNT WORK! FIX THIS!!!!
                            result.wishlistedGames.splice(index, 1);
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
        },

        getHistory: function(userId) {
            return new Promise((resolve,reject) => {
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
                        resolve(result.searchHistory);
                    }
                })
            })
        },

        popGameFromHistory: function(userId, body) {

            console.log(userId);
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

                        let index = null;
                        for (let i = 0; i < result.searchHistory.length; i++) {
                            if (body.gameID == result.searchHistory[i].gameID) {
                                found = true;
                                index = i;
                                break;
                            }
                        }
                        
                        if (!found) {
                            reject(err);
                        }
                        else {
                            result.searchHistory.splice(index, 1);
                        }

                        users.findByIdAndUpdate(userId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        })
                    }
                })
            })
        },

        pushGameToHistory: function(userId, body) {
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

                        let index;
                        for (let i = 0; i < result.searchHistory.length; i++) {
                            if (body.gameID == result.searchHistory[i].gameID) {
                                found = true;
                                index = i;
                                break;
                            }
                        }

                        // if the game hasn't been found in the array, 
                        //      push the game to the top of the stack
                        if (!found) {
                            result.searchHistory.unshift(body);
                        }
                        // if game exists, 
                        // remove game from the list and 
                        // push the updated game body to the top of the stack
                        else {
                            
                            result.searchHistory.splice(index, 1);
                            result.searchHistory.unshift(body);
                        }

                        users.findByIdAndUpdate(userId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        })
                    }
                })
            })
        },

        pushComment: function(gameId, body) {
            console.log(body);
            console.log(new Date());
            return new Promise(async (resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        body["date"] = new Date();
                        result.comments.push(body);
                        const len = result.comments.length;

                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[len - 1]);
                        })
                    }
                })
            })
        },

        popComment: function(gameId, commentId) {
            return new Promise(async (resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        let found = false;
                        for (let i = 0; i < result.comments.length; i++) {
                            if (result.comments[i]._id == commentId) {
                                result.comments.splice(i, 1);
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            reject("Comment is not in list");
                        }
                        else {
                            games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            })
                        }
                        
                    }
                })
            })
        },

        // new function to replace the old version of GET gamebyid..
        // now merges the CheapShark API and the object stored in MongoDB
        findGameById: function(gameID) {
            return new Promise(async (resolve, reject) => {
                const gameUrl = `https://www.cheapshark.com/api/1.0/games?id=${gameID}`;

                fetch(gameUrl)
                .then(res => res.json())
                .then(data => {
                    games.find({gameId: gameID}, (err, result) => {
                        if (err) {
                            console.log("error");
                            reject(err);
                        }
                        else if (!result) {
                            console.log("No game has been found");
                            reject("No game has been found");
                        }
                        else {
                            const mergeObj = {...data, ...result}; // combine two objects into one
                            resolve(mergeObj);
                        }
                    })
                })
                .catch(error => console.log('error', error));
            })
        },

        updateGameView: function (gameIdDb, body) {
            console.log(body)
            return new Promise(async (resolve, reject) => {
                games.findOne(
                    { gameId: gameIdDb }, (err, result1) => {
                        games.findById(result1._id, (err, result) => {
                            if (err) {
                                console.log("error1");
                                reject(err);
                            }
                            else if (!result) {
                                console.log("No game has been found");
                                reject("No game has been found");
                            }
                            else {
                                if(result.views){
                                    result.views++;
                                }
                                else{
                                    result.views = 1;
                                }
                                //body["date"] = new Date().setTime(0,0,0); 
                                console.log(result)
                                console.log(new Date(body["date"]))
                                //console.log(result.timedViews[(result.timedViews.length)-1].date)
                                if (result.timedViews[0]) {
                                    console.log((result.timedViews.length) - 1)
                                    if (result.timedViews[(result.timedViews.length) - 1].date.getTime() == new Date(body["date"]).getTime()) {
                                        console.log("Changing")
                                        result.timedViews[(result.timedViews.length) - 1].views += 1;
                                        console.log(result.timedViews[(result.timedViews.length) - 1].views)
                                    } else {
                                        console.log("not changing")
                                        result.timedViews.push(body);
                                    }
                                } else {
                                    result.timedViews.push(body);
                                }
                                const len = result.timedViews.length;

                                games.findByIdAndUpdate(result1._id, result, { new: true }, (err, result) => {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve(result.timedViews[len - 1]);
                                })
                            }
                        })
                    }).then(

                    )


            })
        },

        gameMostViewed: function () {
            return new Promise((resolve, reject) => {
                games.find({}).sort({ views: -1 }).limit(20).then((results) => resolve(results))
                    .catch((error) => reject(error))
            })
        },

        gameMostRecentViewed: function () {
            return new Promise((resolve, reject) => {


                var d = new Date();
                d.setMonth(d.getMonth() - 1);
                d.setHours(0, 0, 0, 0)
                // const date1 = new Date('2/13/2021');
                const today = new Date();
                console.log(d)
                //aggregate unwinding timedViews,
                //getting only dates from date d to today of main object,
                // group the dates relating to id of game.
                games.aggregate([{
                    $unwind: "$timedViews"
                },
                {
                    $match: {
                        "timedViews.date": {
                            $gte: d,
                            $lte: new Date()
                        }
                    }
                },
                {
                    $group: {
                        "_id": "$_id",
                        "gameName": {
                            "$first": "$gameName"
                        },
                        "gameId": {
                            "$first": "$gameId"
                        },
                        timedView: {
                            "$push": "$timedViews"
                        }
                    }
                }]).then(results => {
                    //console.log(results)
                    var array = [];
                    for (i = 0; i < results.length; ++i) {
                        let total = 0;
                        for (l = 0; l < results[i].timedView.length; ++l) {
                            //calculate how many day has been for that amount of view
                            let diffTime = Math.abs(today - results[i].timedView[l].date);
                            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            console.log(diffDays + results[i].timedView[l].date)
                            //algorithm to give score relating to view
                            // bigget total would have a bigger weight.
                            total += parseFloat(results[i].timedView[l].views * 100) - parseFloat(results[i].timedView[l].views * diffDays * 3);
                            //console.log(total)
                        }
                        console.log(total)
                        var obj = { views: total, gameId: results[i].gameId, gameName: results[i].gameName }
                        array.push(obj);
                    }

                    return array
                }).then((results) => {
                    var x = results.sort((a, b) => Number(b.views) - Number(a.views))
                    x.splice(10)
                    console.log(x)
                    resolve(x)
                })
                    .catch((error) => reject(error))
            })
        },
        
        //Updates theme on mongo to dark/light
        updateTheme: function(userId, body) {
            console.log("Received: " + userId + " "+ body);
            return new Promise((resolve, reject) => {
                users.findByIdAndUpdate(userId, {theme: body}, {new: true}, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                })
            }
        )},
        
        likeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        let userFound = false;
                        for (let i = 0; i < result.comments[idx].userLikes.length; i++) {
                            if (userId == result.comments[idx].userLikes[i]) {
                                userFound = true;
                                break;
                            }
                        }

                        if (userFound) {
                            reject("User already liked it");
                        }
                        else {
                            ++result.comments[idx].upVote;
                            result.comments[idx].userLikes.push(userId);
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },

        unlikeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        for (let i = 0; i < result.comments[idx].userLikes.length; i++) {
                            if (userId == result.comments[idx].userLikes[i]) {
                                result.comments[idx].userLikes.splice(i, 1);
                                break;
                            }
                        }
                        
                        if (result.comments[idx].upVote <= 0) {
                            result.comments[idx].upVote = 0;
                        }
                        else {
                            --result.comments[idx].upVote;
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },
        
        dislikeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        let userFound = false;
                        for (let i = 0; i < result.comments[idx].userDislikes.length; i++) {
                            if (userId == result.comments[idx].userDislikes[i]) {
                                userFound = true;
                                break;
                            }
                        }

                        if (userFound) {
                            reject("User already liked it");
                        }
                        else {
                            ++result.comments[idx].downVote;
                            result.comments[idx].userDislikes.push(userId);
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },
        unDislikeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        for (let i = 0; i < result.comments[idx].userDislikes.length; i++) {
                            if (userId == result.comments[idx].userDislikes[i]) {
                                result.comments[idx].userDislikes.splice(i, 1);
                                break;
                            }
                        }
                        
                        if (result.comments[idx].downVote <= 0) {
                            result.comments[idx].downVote = 0;
                        }
                        else {
                            --result.comments[idx].downVote;
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },

        likeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        let userFound = false;
                        for (let i = 0; i < result.comments[idx].userLikes.length; i++) {
                            if (userId == result.comments[idx].userLikes[i]) {
                                userFound = true;
                                break;
                            }
                        }

                        if (userFound) {
                            reject("User already liked it");
                        }
                        else {
                            ++result.comments[idx].upVote;
                            result.comments[idx].userLikes.push(userId);
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },

        unlikeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        for (let i = 0; i < result.comments[idx].userLikes.length; i++) {
                            if (userId == result.comments[idx].userLikes[i]) {
                                result.comments[idx].userLikes.splice(i, 1);
                                break;
                            }
                        }
                        
                        if (result.comments[idx].upVote <= 0) {
                            result.comments[idx].upVote = 0;
                        }
                        else {
                            --result.comments[idx].upVote;
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },
        
        dislikeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        let userFound = false;
                        for (let i = 0; i < result.comments[idx].userDislikes.length; i++) {
                            if (userId == result.comments[idx].userDislikes[i]) {
                                userFound = true;
                                break;
                            }
                        }

                        if (userFound) {
                            reject("User already liked it");
                        }
                        else {
                            ++result.comments[idx].downVote;
                            result.comments[idx].userDislikes.push(userId);
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        },
        
        unDislikeComment: function(commentId, gameId, userId) {
            let found = false;
            let idx = null;
            return new Promise((resolve, reject) => {
                games.findById(gameId, (err, result) => {
                    if (err) {
                        console.log("error");
                        reject(err);
                    }
                    else if (!result) {
                        console.log("No game has been found");
                        reject("No game has been found");
                    }
                    else {
                        for (let i = 0; i < result.comments.length; i++) {
                            if (commentId == result.comments[i]._id) {
                                idx = i;
                                found = true;
                                break;
                            }
                        }
                        for (let i = 0; i < result.comments[idx].userDislikes.length; i++) {
                            if (userId == result.comments[idx].userDislikes[i]) {
                                result.comments[idx].userDislikes.splice(i, 1);
                                break;
                            }
                        }
                        
                        if (result.comments[idx].downVote <= 0) {
                            result.comments[idx].downVote = 0;
                        }
                        else {
                            --result.comments[idx].downVote;
                        }
                    }
                    if (found) {
                        games.findByIdAndUpdate(gameId, result, { new: true }, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result.comments[idx]);
                        })
                    }
                    else {
                        reject("Cant' like the comment");
                    }

                })
            })
        }

    
    }

    

}   