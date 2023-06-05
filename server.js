import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');


// Imports the routes for interacting with the files in the Router folder
import googleRoute from './Routes/google-api';
import mongoUsersRoute from './Routes/mongo-users';
import mongoTripsRoute from './Routes/mongo-trips';


// Defines the options for CORS
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allow GET and POST requests
  preflightContinue: false, // Enable preflight requests
  optionsSuccessStatus: 204, // Return 204 status for successful preflight requests
};


// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors())


// Adds the Route's file's routes to the application at the root path
app.use("/", googleRoute);
app.use("/", mongoUsersRoute);
app.use("/", mongoTripsRoute);


// Start of routes
app.get("/", (req, res) => {
  const welcomeMessage = "Final project API";
  const endpoints = listEndpoints(app);

  res.status(200).json({
    success: true,
    message: "OK",
    body: {
      welcomeMessage,
      endpoints
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});