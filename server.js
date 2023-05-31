import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API_KEY
const fetch = require('node-fetch');

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST'], // Allow GET and POST requests
  preflightContinue: false, // Enable preflight requests
  optionsSuccessStatus: 204, // Return 204 status for successful preflight requests
};

// Add middlewares to enable cors and json body parsing
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors())  // Enable CORS preflight for all routes

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

const { Schema } = mongoose;
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // minLength: 6
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
});

const User = mongoose.model("User", UserSchema);

// REMOVE LATER!!!! ONLY FOR TESTING PURPOSES!!!
app.get("/users", async (req, res) => {
  try {
  const allUsers = await User.find();
  if (allUsers) {
    res.status(200).json({
      success: true,
      body: allUsers,
      message: "hej hej",
    })
  }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    })
  }
})

// CREATE A NEW USER
app.post("/users/register", async (req, res) => {
  const { username, password } = req.body
  // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,32}$/;
    // This regular expression ensures:
    // At least one digit: (?=.*\d)
    // At least one lowercase letter: (?=.*[a-z])
    // At least one uppercase letter: (?=.*[A-Z])
    // At least one special character: (?=.*[!@#\$%\^&\*])
    // A total length of between 8 and 32 characters: .{8,32}

  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({
  //     success: false,
  //     response: {
  //       message: "Password needs to be between 8 and 32 characters, and include at least one number, one uppercase letter, one lowercase letter, and one special character."
  //     }
  //   })
  // }

  // const existingUserName = await User.findOne({ username: username});
  // if (existingUserName) {
  //   return res.status(400).json({
  //     success: false,
  //     response: {
  //       message: "Username is already taken"
  //     }
  //   })
  // }
  try {
    const salt = bcrypt.genSaltSync();
    const newUser = await new User({
      username: username,
      password: bcrypt.hashSync(password, salt)
    }).save();

    res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        id: newUser._id,
        accessToken: newUser.accessToken,
        message: "User successfully created"
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: {
        error: error,
        message: "Could not create user"
      }
    })
  }
});

// LOGIN IN USER
app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          accessToken: user.accessToken,
          message: 'You are logged in, yay!'
        }
      })
    } else {
      res.status(404).json({
        success: false,
        response: {
          message: 'Invalid credentials'
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    })
  }
});

// MIDDLEWARE TO AUTHENTICATE THE USER
// SHOULD THIS BE MOVED UP TO MIDDLEWARES????????????????

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  try {
    const user = await User.findOne({ accessToken });
    if (user) {
      next();
    } else {
      res.status(400).json({
        success: false,
        response: {
          message: 'You need to log in'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
}

// ENDPOINT ONLY AUTHENTICATED USERS CAN SEE
app.get("/content", authenticateUser);
app.get("/content", async (req, res) => {
  res.status(200).json({
    success: true,
    response: {
      message: 'Secret content here'
    }
  })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});