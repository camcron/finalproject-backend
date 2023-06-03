import mongoose from 'mongoose';

const { Schema } = mongoose;
const CardSchema = new mongoose.Schema({
  cardIcon: {
    type: String,
    default: ""
  },
  cardName: {
    type: String,
    default: ""
  },
  cardPhotoRef: {
    type: String,
    default: ""
  },
  cardPlaceId: {
    type: String,
    default: ""
  },
  cardRating: {
    type: Number,
    default: null
  },
  cardVicinity: {
    type: String,
    default: ""
  },
  cardComment: {
    type: String,
    default: "",
    maxLength: 100
  },
  cardStars: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Card = mongoose.model("Card", CardSchema);

export default CardSchema;