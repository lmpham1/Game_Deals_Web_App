## (March 11th, 2021)
### Added share buttons to search table
* Added Twitter share button to post game deal page
* Added Facebook share button to post game deal page
* Added copy link to clipboard for the game deal page

## (March 11th, 2021)
### Added features for home page
* Added a slide show for trending games
* Added carousel sliders for games from all stores in CheapShark API
* Made each carousel item clickable so that the user can view details/add to wishlist/go to the store page

## (March 9th, 2021)
### Added a sorting functionality to the wishlisted games.
* Implemented changing of backend user information schema.
* Implemented backend reques handling and code.
* Add a clickable section over the sorting area in the frontend.
* Displaying icon to show the direction (asc, desc) of sorting.

## (March 7th, 2021)
### Added like/dislike functionality to Game Details Component
* Implemented backend code to like/unlike comments
* Added buttons in the comments component
* Successfully like/unlike comments and incremenet/decrement without refreshing the page

## (February 22nd, 2021)
### Added Recent View Game List
* Changed the Top Viewed games component to also show a recent viewed games.
* Changed the backend to handle requests relating to the recent viewed games.
* Add backend functionality to get only the top 10 most viewed games in the last 30 days, decreasing the weight of the view count for each day it passed.

## (February 17th, 2021)
### Added some functionalities to Game Search component
* Created an "Add to wishlist" button for each game in the search result
* Implemented pagination for the search results, showing 10 games at a time

## (February 16th, 2021)
### Implemented dark mode
* Implemented global stylesheet and dark theme
* Added dark mode toggle to switch between light theme (default) and dark theme
* Wrote backend code to save theme setting to user account so proper theme is loaded upon login
* Updated some CSS across the site

## (February 15th, 2021)
### Implemented the comment section under the game-details page
* Wrote backend code that allows users to add and delete a comment
* Comments will be saved in the database 
* Create a new component in game-details page that allows users to comment about the game and view other comments

## (January 28th, 2021)
### Added User Registration functionality
* Created route for user registration page
* Added front-end validation for form submission
* Wrote function to check for existing user in database for back-end validation

## (January 27th, 2021)
### Added most viewed games functionality to the web app
* Changed the backend function to update games in the gameAPI to create and increment the view property.
* Write the backend request handler and function to show top 20 most viewed games.
* Create the route and component in the frontend application to show the most viewed games in a simple list with picture, title and price.

## (January 19th, 2021)
### Added search history functionality to the web app (author - Kyle Alialy)
[Issue #19](https://github.com/SenecaCollegeBTSProjects/Group_08/issues/19)
* Write the backend code to push a game to the user's search history stack.
* Write the backend code to remove a specific game from the search history stack.
* New GET request in Web API that gets all games in the user's search history
* Created a route in the web app to show user's search history and the table that includes the game title, the thumbnail, price and date of visit.
* Added a delete button if users want to delete the game from their search history.

## (January 16th, 2021)
### Added game info from CheapShark API to our database
* Successfully added 36626 games from CheapShark API to our database
* Added a route to query a game from our database using its CheapShark ID

## (December 8th, 2020)
* Updated the wishlist UI. Replaced create/delete alert buttons with a slider toggle and modal input

## (November 18th, 2020)

### Create the wishlist page/component.
* Changed the way login and logout looks.
* Added the wishlist page.
* Succesfully show list of games in user's wishlist.
* Remove item function from Wishlist working.

### Dynamically fetch info and deals for a specific game and add/remove game from user's wishlist
* Successfully fetched data dynamically
* Connected get all games component to game details component
* Created add/remove game from wishlist

### Enhance game search component
* Added price filter
* Added store filter
* Added on-sale-only filter
* Added sorting features (by game name, sale price, retail price and saved amounts)

### Implement email alerts for price drop on wishlisted games
* Added function to create email alerts based on user inputed price in the Wishlist page
* Added function to delete existing alerts
* Wishlist page now displays if the user has any active alerts 
* Users can update their alert threshold for a game by inputting a new price and creating another alert; this overwrites current alert.

## (October 15th, 2020)

### Login component message and function working.
* Authenticate users in login component.
* Display messages with user credential fails.
* Create cookie on client browser to user as serialization and deserialization.

### Navigation bar and routes set up
* Created links between routing paths and components
* Created navigation bar with links and login button
### Setup game-details page
* Display important information about game (release date, cheapest price ever, reviews)
* Display current deals for the game (sorted by cheapest to most expensive)

### Added search functionality to the front-end
* A search engine for the games in the database has been implemented
* Added routes to get list of stores and list of deals from CheapShark API to our API

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
