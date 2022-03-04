# Shop Shop
An e-commerce website with a persistant cart that uses Redux and IndexedDB, user sign in, and Swipe for payment processing. 

## Description
Upon opening the application for the first time, the user is met with all the products on a single page. They can filter the products by category with the list at the top of the screen. By clicking on an item, the user is brought to a product page which contains a description of the item along with a large image. The user can add items to their cart from either the single product page or the product list page, and are able to update quantities and remove items from their cart by accessing the cart component from any page. 

### Category Page
Displays all products belonging to the selected category. Can add items to cart from this page, or select a product for more information. 

### Product Page
Presents the user with a description about the product, as well as the option to add the item to their cart or remove it if it is already in. 

### Cart
The cart component is available from every page except the signup or login page. It persists through multiple sessions by utilizing IndexedDB, and throughout a session it stores its contents in a global state object using Redux. Users can both update item quantity or remove an item entirely from the cart component. 

### Check Out
The checkout feature is facilitated by the Swipe API. The items, their quantities and their prices are packaged together and sent to the Swipe servers where the total cost is then calculated and displayed to the user who is then prompted to provide their credit card information to complete payment. 

## Technologies Used
The following npm packages were used in the development of this application: 
* stripe/stripe-js v1.22.0
* apollo/client v3.3.7
* apollo-server-express v2.11.0
* graphql v14.6.0
* jwt-decode v2.2.0
* react v16.13.1
* redux v4.1.2
* bcrypt v4.0.1
* express v4.17.1
* jsonwebtoken v8.5.1
* mongoose v5.9.0