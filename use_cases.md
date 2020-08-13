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
    - The system will inform the user that “No games are found. Please try again.”
- If the user searches for a game that completely matches a game title:
    - The system will redirect the user to the game’s main page and display all the important information about the game

### Postconditions

If games are found, the system will return a list of games matching the string and display them on the webpage.


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

### Actor (User)
User has a wishlisted item (game) in the system.

### Pre-conditions
A game has a price drop. There is a user in the system that has the game wishlisted with the price drop that is lower than their notification price.

### Main Flow
1. The user searches for a game on the website.
2. The user clicks **Notify Me** button.
3. The user enters the price notification threshold.
4. The user clicks **Submit**
5. The system saves this notification request.
6. The system sends out an email when the game price is lower than the price notification threshold.

### Alternate Flows
- If the user is not logged in:
  1. After step 3, the unregistered user will enter their email address so it knows where to send notification to.
- If the user is logged in and has wishlisted items:
  1. The user clicks on the **Wishlist** button
  2. The system displays wishlisted games.
  3. Return to main flow step 2. 

### Postconditions
After the notification is sent, users will get an email with the game information, previous game price, current price, and amount it has been discounted by.
