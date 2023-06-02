const apiKey = process.env.API_KEY
import express from "express";
import fetch from 'node-fetch';
const app = express();
const router=express.Router()

// Getting the lng, lat from the frontend to pass to PLaces API
router.post('/api/places', async (req, res) => {
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

export default router;




  // POST request to Goggle Place Details
// using the place_id from the frontend
// Endpoint is not using slug correctly
// app.post('/api/places/:placeId', async (req, res) => {
//   const placeId = req.body.place_id
//   const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

//   try {
//     const placeDetailsResp = await fetch(placeDetailsUrl);
//     if (placeDetailsResp.ok) {
//       const placeDetailData = await placeDetailsResp.json();
//       res.json(placeDetailData);
//     } else {
//       throw new Error(`Google Places Details API error! Status: ${placeDetailsResp.status}`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });