// import authenticateUser from '../Middlewares/middlewares'
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

router.post("/trips", async (req, res) => {
  try {
    const { name, activeuser } = req.body;
    // const accessToken = req.header("Authorization");
    // const user = await User.findOne({accessToken: accessToken});
    const newTrip = await new Trip({
      name: name, 
      // previous: previous,
      // bucketlist: bucketlist,
      // upcoming: upcoming,
      activeuser: activeuser,
      // createdAt: createdAt,
      // cards: cards
    }).save();
    res.status(201).json({
      success: true, 
      response: {
        message: "new trip successfully created",
        data: newTrip
    },
    })
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
  
export default router;