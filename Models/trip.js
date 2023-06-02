import mongoose from 'mongoose';
import CardSchema from './card.js';

const { Schema } = mongoose;
const TripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // minLength: 2,
    // maxLength: 50
  },
  previous: {
    type: Boolean,
    default: false,
  },
  bucketlist: {
    type: Boolean,
    default: false,
  },
  upcoming: {
    type: Boolean,
    default: false,
  },
  activeuser: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  cards: [CardSchema]
});

const Trip = mongoose.model("Trip", TripSchema);

module.exports = Trip;