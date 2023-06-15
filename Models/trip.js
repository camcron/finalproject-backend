import mongoose from 'mongoose';
import CardSchema from './card.js';

const { Schema } = mongoose;
const TripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
    maxlength: 30
  },
  tripPrevious: {
    type: Boolean,
    default: false,
  },
  tripBucketlist: {
    type: Boolean,
    default: false,
  },
  tripUpcoming: {
    type: Boolean,
    default: false,
  },
  tripActiveuser: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cards: [CardSchema]
});

const Trip = mongoose.model("Trip", TripSchema);

module.exports = Trip;