import { User } from '../Models/user.js';

// MIDDLEWARE TO AUTHENTICATE THE USER

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


export default authenticateUser;