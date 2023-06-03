import mongoose from 'mongoose';
import crypto from 'crypto'

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
  _id: {
    type: String,
    required: true 
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  },
  profileName: {
    type: String,
    default: ""
  },
  profileText: {
    type: String,
    default: ""
    // trim: true
    // minlength: 10,
    // maxlength: 250
  },
  profilePicture: {
    type: String,
    default: "https://i.postimg.cc/vmZr7ryp/istockphoto-470100848-612x612.jpg"
    // data: Buffer, What does this mean??
  },
  profileInstagram: {
    type: String,
    default: ""
  }
});

const User = mongoose.model("User", UserSchema);

export default User;