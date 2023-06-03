import User from '../Models/user';

// MIDDLEWARE TO AUTHENTICATE THE USER

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  // console.log('accessToken:', accessToken)
  try {
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        response: {
          message: 'Authentication required. Access token not provided.',
        },
      });
    }

    const loggedinuser = await User.findOne({ accessToken });
    if (loggedinuser) {
      req.accessToken = accessToken;
      req.loggedinuser = loggedinuser;
      next();
    } else {
      res.status(401).json({
        success: false,
        response: {
          message: 'Invalid access token. You need to log in.',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
    });
  }
};

export default authenticateUser;