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
    const { tripName } = req.body;
    const loggedinuser = req.loggedinuser; // Access the currently logged in user from req object

    const newTrip = await new Trip({
      tripName: tripName, 
      tripActiveuser: loggedinuser._id,
    }).save();
    if (newTrip) {
      res.status(201).json({
        success: true, 
        response: {
          message: "New trip successfully created",
          data: newTrip
      } 
      })
    } else {
      res.status(404).json({
        success: false, 
        response: {
          message: "Trip not created",
      } 
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false, 
      response: error, 
      message: "An error occurred while trying to create a new trip"
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
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error
      })
    }
  })


  router.get("/trips/:tripId", async (req, res) => {
    const { tripId } = req.params; // Get the trip id from the request parameters
    try {
    const singleTrip = await Trip.findById(tripId);
    if (singleTrip) {
      res.status(200).json({
        success: true,
        response: {
            message: "Successful fetch",
            data: singleTrip,
        }
      })
    }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error
      })
    }
  })


  router.patch("/trips/:tripId/cards", async (req, res) => {
    try {
      const { tripId } = req.params; // Get the trip id from the request parameters
      // const { cardComment, cardStars } = req.body; // Get the fields for the new Card from the request body
      // const { cardIcon, cardName, cardPhotoRef, cardPlaceId, cardRating, cardVicinity } = req.body;
  
      // Find the trip by its id and update it using $push operator to add a new card to the cards array
      const updatedTrip = await Trip.findByIdAndUpdate(
        tripId,
        { $push: { cards: {} } },
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
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while adding the card to the trip",
      });
    }
  });

  
router.patch("/trips/:tripId/cards/:cardId", authenticateUser);
router.patch("/trips/:tripId/cards/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params; // Get the user id from the request parameters
    const { cardComment, cardStars } = req.body; 

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { 
        cardComment: cardComment, 
        cardStars: cardStars 
      },
      { new: true } 
    );
    if (updatedCard) {
      res.status(200).json({
        success: true,
        response: {
          message: "Card successfully updated",
          data: updatedCard,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        response: {
          message: "Card could not be updated",
        },
      });
    }} catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while updating the card",
      });
    }
  });


    /*
    if (id === loggedinUserId.toString()) {
      // Only allow access if the requested ID matches the logged-in user's ID
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          profileName: profileName,
          profileText: profileText,
          profilePicture: profilePicture,
          profileInstagram: profileInstagram
        },
        { new: true }
      );
      if (updatedUser) {
        res.status(200).json({
          success: true,
          response: {
            message: "User successfully updated",
            data: updatedUser,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          response: {
            message: "User could not be updated",
          },
        });
      }
    } else {
      // If the requested ID does not match the logged-in user's ID
      res.status(403).json({
        success: false,
        response: {
          message: 'You are not authorized to update this user'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "An error occurred while updating the user",
    });
  }
});
*/
  
export default router;