import authenticateUser from '../Middlewares/middlewares'
import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import Trip from '../Models/trip';


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


router.post("/trips", authenticateUser);
router.post("/trips", async (req, res) => {
  try {
    const { name } = req.body;
    const loggedinuser = req.loggedinuser; // Access the currently logged in user from req object

    const newTrip = await new Trip({
      name: name, 
      activeuser: loggedinuser._id,
    }).save();
    if (newTrip) {
      res.status(201).json({
        success: true, 
        response: {
          message: "new trip successfully created",
          data: newTrip
      } 
      })
    } else {
      res.status(404).json({
        success: false, 
        response: {
          message: "trip not created",
      } 
      })
    }
  } catch (e) {
    res.status(500).json({
      success: false, 
      response: e, 
      message: "not working"
    });
  }
})


router.get("/trips", async (req, res) => {
    try {
    const allTrips = await Trip.find();
    if (allTrips) {
      res.status(200).json({
        success: true,
        response: {
            message: "Successful fetch",
            data: allTrips,
        }
      })
    }
    } catch (e) {
      res.status(500).json({
        success: false,
        response: e
      })
    }
  })


  router.get("/trips/:id", async (req, res) => {
    const { id } = req.params; // Get the trip id from the request parameters
    try {
    const singleTrip = await Trip.findById(id);
    if (singleTrip) {
      res.status(200).json({
        success: true,
        response: {
            message: "Successful fetch",
            data: singleTrip,
        }
      })
    }
    } catch (e) {
      res.status(500).json({
        success: false,
        response: e
      })
    }
  })


  router.patch("/trips/:id/cards", async (req, res) => {
    try {
      const { id } = req.params; // Get the trip id from the request parameters
      const { message, content } = req.body; // Get the fields for the new Card from the request body
  
      // Find the trip by its id and update it using $push operator to add a new card to the cards array
      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        { $push: { cards: { message, content } } },
        { new: true } // To return the updated trip document
      );
      if (updatedTrip) {
        res.status(200).json({
          success: true,
          response: {
            message: "Card successfully added to trip",
            data: updatedTrip,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          response: {
            message: "Trip not found",
          },
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        response: e,
        message: "An error occurred while adding the card to the trip",
      });
    }
  });
  
export default router;