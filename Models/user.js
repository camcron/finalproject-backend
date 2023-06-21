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
    minLength: 6
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  },
  profileName: {
    type: String,
    default: "",
    trim: true,
    maxlength: 30
  },
  profileText: {
    type: String,
    default: "",
    trim: true,
    maxlength: 100
  },
  profilePicture: {
    type: String,
    default: "https://i.postimg.cc/fy9shD4Q/3530467.jpg"
  },
  profileInstagram: {
    type: String,
    default: ""
  }
});

const User = mongoose.model("User", UserSchema);

export default User;