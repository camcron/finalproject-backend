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
    // default: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
    default: "https://www.flaticon.com/free-icon/woman_4140065?term=avatar&page=2&position=39&origin=tag&related_id=4140065"
  },
  profileInstagram: {
    type: String,
    default: ""
  }
});

const User = mongoose.model("User", UserSchema);

export default User;