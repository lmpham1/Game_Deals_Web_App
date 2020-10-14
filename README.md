# Group_08

## Members
| Name           | Github         | Email                  | Skype                 |
| -------------- | -------------- | ---------------------- | --------------------- |
| Kyle Alialy    | kjalialy       | kjalialy@myseneca.ca   | kjalialy09@gmail.com  |
| Bennet Ngan    | bjfngan        | bjfngan@myseneca.ca    | bennet.n@hotmail.com  |
| Artur Pinheiro | arturcpinheiro | apinheiro3@myseneca.ca | artur_c_p@hotmail.com |
| Le Minh Pham   | lmpham1        | lmpham1@myseneca.ca    | est2000vn@gmail.com   |

## Project Description

Our project aims to create a webapp that compares prices of digital games from different digital storefronts, stores users' game preferences, and sends notifications when there are promotions for their wishlisted or trending games.

### Searching for Games
Our main use case starts with users searching for a game on the webapp, then the webapp will display the results with their prices from different stores. Users will have the option to sort the games based on their prices, their rankings, or filter games from specific stores/categories. Users can click on a game to be redirected to the corresponding store. This use case does not require any authentication from the users. Searching for games will utilize the following APIs:
* SteamAPI:https://partner.steamgames.com/doc/home
* GOGAPI: https://gogapidocs.readthedocs.io/en/latest/
* Epic Games API: https://dev.epicgames.com/docs/services/en-US/

### Creating a Wishlist
The user can choose to create an account to wishlist their favorite games and get notifications when their prices drop. On each game’s information page there will be a button that allows users to add to their wishlist. Users will have access to a wishlist page that displays all their wishlisted games and prices.
