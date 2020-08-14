# Use Cases

## Search for a particular game (done by Kyle)

### Actor (User)

Any user

### Pre-conditions

User must have access to the web application to search for a particular game in the database

### Main Flow

1. The user clicks on the search bar located in the **Navigation Bar** on the top of the web application or the search bar on the main/home page
2. The user inputs a string of characters for the desired game
3. The user clicks on the **Submit** button
4. The system receives the string and searches through the database
5. If game(s) found, the system will return a list of games that matches the string

### Alternate Flow

- If no results were found:
    1. The system will inform the user that “No games are found. Please try again.”
- If the user searches for a game that completely matches a game title:
    1. The system will redirect the user to the game’s page and display all the important information about the game

### Postconditions

If games are found, the system will return a list of games matching the string and display them on the webpage. Then, the user can click on his/her's desired game and will be redirected to the game's page


---


## Add An Item to the Wishlist (done by Minh Pham)

### Actor

Logged-in User

### Pre-Conditions

The user is logged in, and the system is displaying a list of games the user has searched.

### Main Flow

1. The user click the "Add To Wishlist" button next to a game's name
2. The system adds the game to the user's wishlist
3. The system notifies the user that the game is successfully added to the wishlist

## Alternative Flows

- If the game already exists in the user's wishlist, the "Add To Wishlist" button is greyed out and the user cannot click on it.
- If the user is not logged in:
    1. The system will alert the user that they have to log in first, and provide the options to log in or register an account.
    2. After the user click on an option, the system will redirect the user to the corresponding page

## Post-Conditions

The game is added to the user's wishlist and the user is notified of the successful addition.


---


## Sending Notification for Price Drops (done by Bennet)

### Actor (System)
The system that checks for price drops.

### Pre-conditions
A game has a price drop. There is a user in the system that has the game wishlisted with a price drop.

### Main Flow
1. The system periodically checks wishlited games for price changes (twice a day) via API.
2. If a wishlisted game is one sale, the system groups together users who have wishlisted the game.
2. The system sends out an email notification containing details of price drop to group of users.

### Alternate Flows
- If there are no wishlisted games:
    1. The system does not run price drop checks.
- If there are no wishlisted games with a price drop:
    1. The system does not send out price drop notifications.

### Postconditions
After the notification is sent, users will get an email with the game information, previous game price, current price, and amount it has been discounted by.


---


## Create an Account (done by Artur)

### Actor (User)

Any user

## Pre-conditions

User must have access to the web application and a valid email to create an account.

## Main Flow

1. The User press the "Sign in" button at the top of the screen.
2. System will display the account creation formulary.
3. User fills formulary.
4. System checks for any problem in the formulary.
5. User submits formulary.
6. System checks for any duplicate information in the system.
6. System saves account information in database.
7. System sends account verification email to user.
8. User verifies email by clicking at the email’s link.
9. System verify user in database and update it.

## Alternate Flow

- If Account name already in use:
    1. The system will inform the user that “Account name already in use.”
- If Account name length less than 5 or more than 20 characters:
    1. The system will inform the user that “Account length invalid.”
- If password length less than 8:
    1. The system will inform the user that “Password length invalid.”
- If email already in use:
    1. The system will inform the user that “Email already in use.”
- If user does not verifies his email in 24 hours:
    1. The system will delete user's information from database.

## Postconditions

User's account is created and user is able to login to the web application.