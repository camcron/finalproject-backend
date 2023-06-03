import User from '../Models/user';

// MIDDLEWARE TO AUTHENTICATE THE USER

const authenticateUser = async (req, res, next) => {
    const accessToken = req.header('Authorization');
    try {
      const loggedinuser = await User.findOne({ accessToken });
      if (loggedinuser) {
        // req.accessToken = accessToken; // Add accessToken to req object
        req.loggedinuser = loggedinuser; // Add user to req object
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