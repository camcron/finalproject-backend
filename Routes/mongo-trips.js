import authenticateUser from '../Middlewares/middlewares'
import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import Trip from '../Models/trip';


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// POST new trip to the logged in user
router.post("/trips", authenticateUser, async (req, res) => {
  try {
    const { tripName } = req.body;
    const loggedinuser = req.loggedinuser;

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
          message: "Trip could not be created",
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

  // GET all trips only from logged in user
router.get("/trips", authenticateUser, async (req, res) => {
  const loggedinUserId = req.loggedinuser._id;

  try {
    const allTrips = await Trip.find({ tripActiveuser: loggedinUserId });
    
      if (allTrips) {
        res.status(200).json({
          success: true,
          response: {
            message: "Successfully fetched all trips",
            data: allTrips,
          }
        })
      } else {
        res.status(404).json({
          success: false, 
          response: {
            message: "Could not fetch all trips",
          } 
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while trying to fetch all trips"
      })
    }
  })


// GET a single trip
router.get("/trips/:tripId", authenticateUser, async (req, res) => {
  const { tripId } = req.params;
  const loggedinUserId = req.loggedinuser._id;

  try {
    const singleTrip = await Trip.findById(tripId);

    // check if singleTrip is found
    if (singleTrip) {
      // Check if the active user is the same as the logged-in user
      if (singleTrip.activeuser === loggedinUserId) {
        res.status(200).json({
          success: true,
          response: {
            message: "Successfully fetched the trip",
            data: singleTrip,
          }
        });
      } else {
        res.status(403).json({
          success: false,
          response: {
            message: "Access denied. User does not have permission to view this trip.",
          }
        });
      }
    } else {
      res.status(404).json({
        success: false,
        response: {
          message: "Could not fetch the trip",
        } 
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "An error occurred while trying to fetch the trip"
    });
  }
});


//////////////////////////////////////////////////
// PATCH a single trips filter and name
// PUTTING THIS ONE ON PAUSE!!
router.patch("/trips/:tripId", authenticateUser, async (req, res) => {
  const { tripId } = req.params; 
  // const loggedinUserId = req.loggedinuser._id;

  try {
    const { tripName, tripPrevious, tripBucketlist, tripUpcoming } = req.body; 

    const updatedSingleTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        tripName: tripName,
        tripPrevious: tripPrevious,
        tripBucketlist: tripBucketlist,
        tripUpcoming: tripUpcoming
      },
      { new: true, runValidators: true }
    );

    if (updatedSingleTrip) {
      res.status(200).json({
        success: true,
        response: {
            message: "Successfully updated the trip",
            data: updatedSingleTrip,
          }
        });
      } else {
        res.status(404).json({
          success: false, 
          response: {
            message: "Could not update the trip",
          } 
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while trying to update the trip"
      })
    }
  })
//////////////////////////////////////////////////



// DELETE single trip
router.delete("/trips/:tripId", authenticateUser, async (req, res) => {
  const { tripId } = req.params;
  // const loggedinUserId = req.loggedinuser._id;

  try {
    const deleteTrip = await Trip.findByIdAndDelete(tripId);
    console.log("deleteTrip:", deleteTrip);

    if (deleteTrip) {
      res.status(201).json({
        success: true,
        response: {
          message: "Successfully deleted trip",
        },
      });
    } else {
      res.status(404).json({
        success: false,
        response: {
          message: "Trip could not be deleted",
        },
      });
    }
  } catch (error) {
    console.log("Error deleting trip:", error);
    res.status(500).json({
      success: false,
      response: error,
      message: "An error occurred while trying to delete a trip",
    });
  }
});



// PATCH to add a new card to a single trip
router.patch("/trips/:tripId/cards", authenticateUser, async (req, res) => {
  const { tripId } = req.params;
  const loggedinUserId = req.loggedinuser._id; // Get the ID of the logged-in user

  try {
    const { cardIcon, cardName, cardPhotoRef, cardPlaceId, cardRating, cardVicinity } = req.body;

    // Find the trip by its id and update it using $push operator to add a new card to the cards array
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { cards: { cardIcon, cardName, cardPhotoRef, cardPlaceId, cardRating, cardVicinity } } },
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
          message: "Card could not be added to the trip",
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

  
// PATCH to add and change comments and stars of a single card in a single trip
router.patch("/trips/:tripId/cards/:cardId", authenticateUser, async (req, res) => {
  const { tripId, cardId } = req.params;

  try {
    const { cardComment, cardStars } = req.body; 

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip could not be found",
      });
    }

    const updateCard = trip.cards.id(cardId);

    if (!updateCard) {
      return res.status(404).json({
        success: false,
        message: "Card could not be found",
      });
    }

      updateCard.cardComment = cardComment;
      updateCard.cardStars = cardStars;

      await trip.save()
    
      res.status(200).json({
        success: true,
        response: {
          message: "Card successfully updated",
          data: updateCard,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while updating the card",
      });
    }
  });


// DELETE single card in a Trip's array of Cards
router.delete("/trips/:tripId/cards/:cardId", authenticateUser, async (req, res) => {
  const loggedinUserId = req.loggedinuser._id;
  const { tripId, cardId } = req.params;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip could not be found",
      });
    }

    const card = trip.cards.id(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card could not be found",
      });
    }

    await Trip.findByIdAndUpdate(
      tripId, 
      { $pull: { cards: { _id: cardId } } }, 
      { new: true }
    ); 

      res.status(200).json({
        success: true, 
        response: {
          message: "Successfully deleted card",
      } 
    })
  } catch (error) {
    res.status(500).json({
      success: false, 
      response: error, 
      message: "An error occurred while trying to delete a card"
    });
  }
})
  
export default router;