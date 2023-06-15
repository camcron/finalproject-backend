const apiKey = process.env.API_KEY
import express from "express";
import fetch from 'node-fetch';
const app = express();
const router=express.Router()

router.post('/api/places', async (req, res) => {
    const { lng, lat, type } = req.body;
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=${type}&radius=25000&key=${apiKey}`;
  
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

export default router;
