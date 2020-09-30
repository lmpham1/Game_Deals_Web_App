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
        }
    }

}