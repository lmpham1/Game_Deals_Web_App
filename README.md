# Group_08

## Members
| Name           | Github         | Email                  | Skype                 |
| -------------- | -------------- | ---------------------- | --------------------- |
| Kyle Alialy    | kjalialy       | kjalialy@myseneca.ca   | kjalialy09@gmail.com  |
| Bennet Ngan    | bjfngan        | bjfngan@myseneca.ca    | bennet.n@hotmail.com  |
| Artur Pinheiro | arturcpinheiro | apinheiro3@myseneca.ca | artur_c_p@hotmail.com |
| Le Minh Pham   | lmpham1        | lmpham1@myseneca.ca    | est2000vn@gmail.com   |

## Project Idea(s) (to be replaced)

Develop a website related to grocery, games purchase, or warehouse. The website would allow for:

- Creation of accounts
- Products purchase
- Inventory management

A webapp/tool that lets users search for a digital game and compares the prices between digital storefronts to find the cheapest price. 
- Steam, Epic Games Store, GOG (3 biggest pc digital storefronts) have APIs we can utilize to fetch game data and price history. We will look into more storefronts to see if they have readily available APIs.
- Allow user account creation
- Allow users to wishlist games (saved to account) and when logged in users can access this page (or we’ll have some UI element on the main page) to show current lowest prices for these games.
- Allow users to create email notifications to be notified if a game drops below a price
- Have a main search bar and some sort of filtering option for games/categories, etc. 
- (Optional) Create an ad area for revenue.


## Project Description

Project Description

Our project aims to create a webapp that compares prices of digital games from different digital storefronts, stores users' game preferences, and sends notifications when there are promotions for their wishlisted or trending games.
Our main use case starts with users searching for a game on the webapp, then the webapp will display the results with their prices from different stores. Users will have the option to sort the games based on their prices, their rankings, or filter games from specific stores/categories. Users can click on a game to be redirected to the corresponding store. This use case does not require any authentication from the users. However, the users can choose to create an account to wishlist their favorite games and get notifications when their prices drop.
We will use MongoDB to store the collections of games data fetched from the APIs above. We will also use this database to store and manage the collection of user accounts. Upon account creation, users can opt to get email notifications when one of their wishlisted games goes on sale, or when a new, trending game becomes available to purchase. Users can activate or cancel this option at any time.
 
There are many different types of languages and technologies available to us, but we have chosen to start with the React framework and use Javascript for server side coding as we are familiar with this. As mentioned above, we will use MongoDB to handle the database of both user accounts and any other game data we may need to store. Finally, we will also be using HTML and CSS to help create the client side UI. We may incorporate other technologies as we progress through this project, but these are the technologies we are using to start.
 
To get the data about the games and their price history, we will make API requests to different digital game retailers. Currently, we will use public API from 3 retailers:
Steam API:
Full documentation for accessing the steam API is here:
https://partner.steamgames.com/doc/webapi/ISteamApps

To fetch price data:
Each game (including dlcs/soundtracks/etc) has a unique appID that can be found here: https://api.steampowered.com/ISteamApps/GetAppList/v2/	
We simply replace the appID with what we’re searching for in our GET request and it’ll return a JSON with all of that game’s data. Pricing data is under “price_overview”. The following example uses Dark Souls 3 as an example:
https://store.steampowered.com/api/appdetails?appids=374320

GOG (Good Old Games) API:
Full documentation (unofficial) for accessing GOG API is here:
https://gogapidocs.readthedocs.io/en/latest/
Data pricing information is located under the Listing API


Epic Games Store API:
Full documentation for accessing Epic Games Store API (may not be able to fetch pricing data)
https://dev.epicgames.com/docs/services/en-US/

