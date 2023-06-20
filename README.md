# Odyssey - Final Project at Technigo Bootcamp - Backend
This project aims to create a backend system for a Travel Planner application. The application enables users to save ideas, reviews, destinations, attractions, and other related information from their trips. Users can interact with these saved collections, adding comments and ratings.They are also able to explore new destinations and attractions through a public API from Google.

# Objective
The primary challenge is to design a system capable of securely handling user registration, authentication, as well as managing data related to destinations, attractions, user collections, comments, and ratings. The backend API offers several endpoints for these actions, all of which are secured using authentication.

# Features:
User registration and login  
Authenticated access to user data  
Destination and attraction exploration through Google Geocode API and Google Place API  
User can create, view, edit, delete collections  
User can add/remove cards to collections  
Comment and ratings on destinations  

# Technologies Used:
- Node.js
- Express
- CORS
- Mongoose
- MongoDB
- bcrypt
- crypto

# Endpoints/Routes:
/  
GET - Fetch all endpoints  
  
/trips  
POST - Create a new trip for the logged-in user  
GET - Fetch all trips from the logged-in user  
  
/trips/:tripId  
GET - Fetch a single trip by its ID, can be accessed only by the logged-in user  
PATCH - Partially update a single trip details including its name and filters  
DELETE - Delete a single trip by its ID, can be deleted only by the logged-in user  
  
/trips/:tripId/cards  
PATCH - Add a new card to a single trip  
  
/trips/:tripId/cards/:cardId  
PATCH - Add or change comments and stars of a single card in a single trip  
DELETE - Delete a single card in a trip's array of cards  
  
/users  
GET - Fetch all users  
  
/users/register  
POST - Create a new user. Validation of username and password is performed  
  
/users/login  
POST - Authenticate a user and return user information  
  
/users/:userId  
GET - Fetch a single user by its ID, only allows access if the requested ID matches the logged-in user's ID  
PATCH - Update a single user's profile information including profile name, profile text, profile picture, and profile Instagram link. Only allows access if the requested ID matches the logged-in user's ID  
  
/api/places  
POST - Fetch nearby places based on longitude, latitude, and type of place using Google Places API  


# How to Run the API Locally:
Clone the repository  
Install dependencies with npm install  
Make sure MongoDB is installed and running  
Run the server with npm start  
Access the API at http://localhost:8080  

# API Deployed on Google Cloud

# Deployed Frontend
https://final-project-odyssey.netlify.app/

# Frontend repository
https://github.com/mvfrid/finalproject-frontend

