import mongoose from 'mongoose';

const { Schema } = mongoose;
const CardSchema = new mongoose.Schema({
  message: {
    type: String,
    default: "HEJ",
    // minLength: 2,
    // maxLength: 50
  },
  content: {
    type: String,
    default: "CARD"
  }
  // createdAt: {
  //   type: Date,
  //   default: Date.now()
  // }
});

const Card = mongoose.model("Card", CardSchema);

export default CardSchema;