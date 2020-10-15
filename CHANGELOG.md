## (October 15, 2020)

### Navigation bar and routes set up
* Created links between routing paths and components
* Created navigation bar with links and login button
### Setuo game-details page
* Display important information about game (release date, cheapest price ever, reviews)
* Display current deals for the game (sorted by cheapest to most expensive)

## (September 30th, 2020)

### Ecrypting and login completed
* Ecrypting of password was completed using Bcrypt and then stored on mongoDB.
* Login session was completed using passportJS.

### Finish setting up database

* Sucessfully connected API server to MongoDB Atlas database and create the database schema for users.
* Dropped games schema since we are switching to Cheapshark API


### API research

* Dropping SteamAPI/GOG API/Epic Games API and switching to Cheapshark API
* Figured out how to make specific Cheapshark API calls and how to use within the context of our application.

### Added CRUD operations for the user collection

* Added get all, get one, create, update, delete operations for the user collection
* Added associated url in server.js
* Dropped CRUD operations for the game collection since we are switching to Cheapshark API
