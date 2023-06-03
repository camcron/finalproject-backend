import authenticateUser from '../Middlewares/middlewares'
import express from "express";
const router = express.Router()
import mongoose from "mongoose";
// const User = require('../Models/user');
import Trip from '../Models/trip';
// const Card = require('../Models/card');


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// router.use(authenticateUser);
router.post("/trips", authenticateUser);
router.post("/trips", async (req, res) => {
  try {
    const { name } = req.body;
    const accessToken = req.accessToken; // Access the accessToken from req object
    const loggedinuser = req.user; // Access the user from req object

    // const accessToken = req.header("Authorization");
    // const loggedinuser = await User.findOne({accessToken: accessToken});
    const newTrip = await new Trip({
      name: name, 
      // previous: previous,
      // bucketlist: bucketlist,
      // upcoming: upcoming,
      activeuser: loggedinuser._id,
      // createdAt: createdAt,
      // cards: cards
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

// DELETE TRIP?

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


  // GET single trip

  // eg: http://localhost:8080/trips/647a4d774555d972f027f2bc

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

/*
  router.patch("/trips/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const { message } = req.body;
      const newCard = await Card.findByIdAndUpdate(id, { message: message }, { new: true });
  
      if (newCard) {
        res.status(201).json({
          success: true,
          response: {
            message: "New card successfully saved to trip"
          }
        });
      } else {
        res.status(404).json({
          success: false,
          response: {
            message: "Could not save card to trip"
          }
        })
      };
    } catch (err) {
      res.status(400).json({
        success: false,
        message: `Error occurred while trying to update the like`,
        response: err
      });
    }
  });  
  */
  
export default router;