# Use Cases

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