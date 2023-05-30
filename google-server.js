import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API_KEY
const fetch = require('node-fetch');

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8081;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Final project!");
});

// Getting the lng, lat from the frontend to pass to PLaces API
app.post('/api/places', async (req, res) => {
  const { lng, lat } = req.body;
  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=tourist_attraction&radius=1500&key=${apiKey}`;

  try {
    const placesResponse = await fetch(placesUrl);
    if (placesResponse.ok) {
      const placesData = await placesResponse.json();
      res.json(placesData);
    } else {
      throw new Error(`Google Places API error! Status: ${placesResponse.status}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
