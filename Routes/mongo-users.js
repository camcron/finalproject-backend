import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
// import authenticateUser from '../Middlewares/middlewares';
dotenv.config();

import User from '../Models/user';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// REMOVE LATER!!!! ONLY FOR TESTING PURPOSES!!!
router.get("/users", async (req, res) => {
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
router.post("/users/register", async (req, res) => {
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

// LOGIN IN USER
router.post("/users/login", async (req, res) => {
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


// ENDPOINT ONLY AUTHENTICATED USERS CAN SEE
router.get("/content", authenticateUser);
router.get("/content", async (req, res) => {
  res.status(200).json({
    success: true,
    response: {
      message: 'Secret content here'
    }
  })
})

export default router;