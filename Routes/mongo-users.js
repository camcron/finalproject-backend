import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import authenticateUser from '../Middlewares/middlewares'
import User from '../Models/user';

dotenv.config();


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
      message: "All users listed",
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
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,32}$/;
    // This regular expression ensures:
    // At least one digit: (?=.*\d)
    // At least one lowercase letter: (?=.*[a-z])
    // At least one uppercase letter: (?=.*[A-Z])
    // A total length of between 6 and 32 characters: .{6,32}

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      response: {
        message: "Password needs to be between 6 and 32 characters, and include at least one number, one uppercase letter and one lowercase letter."
      }
    })
  }

  const existingUserName = await User.findOne({ username: username});
  if (existingUserName) {
    return res.status(400).json({
      success: false,
      response: {
        message: "Username is already taken"
      }
    })
  }
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
        profileName: newUser.profileName,
        profileText: newUser.profileText,
        profilePicture: newUser.profilePicture,
        profileInstagram: newUser.profileInstagram,
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
          profileName: user.profileName,
          profileText: user.profileText,
          profilePicture: user.profilePicture,
          profileInstagram: user.profileInstagram,
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

// Find singleUser by ID
router.get("/users/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params; // Get the user id from the request parameters
  const loggedinUserId = req.loggedinuser._id; // Get the ID of the logged-in user

  try {
    if (userId === loggedinUserId.toString()) {
      // Only allow access if the requested ID matches the logged-in user's ID
      const singleUser = await User.findById(userId);
      if (singleUser) {
        res.status(200).json({
          success: true,
          body: singleUser,
          message: "Single user listed",
        });
      } else {
        res.status(404).json({
          success: false,
          response: {
            message: 'Could not find user'
          }
        });
      }
    } else {
      // If the requested ID does not match the logged-in user's ID
      res.status(403).json({
        success: false,
        response: {
          message: 'You are not authorized to access this user information'
        }
      });
    }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while fetching the user data",
      })
    }
})


router.patch("/users/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params; // Get the user id from the request parameters

  try {
    const { profileName, profileText, profilePicture, profileInstagram } = req.body; 
    const loggedinUserId = req.loggedinuser._id; // Get the ID of the logged-in user

    if (userId === loggedinUserId.toString()) {
      // Only allow access if the requested ID matches the logged-in user's ID
      const updatedUser = await User.findByIdAndUpdate(
        userId,
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

// Endpoint to get logged-in user  --- REMOVE THIS!
router.get("/users/me", authenticateUser);
router.get("/users/me", (req, res) => {
  const loggedinUser = req.loggedinuser;
  res.status(200).json({
    success: true,
    body: loggedinUser,
    message: "Logged-in user information",
  });
});

export default router;