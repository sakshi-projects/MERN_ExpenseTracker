const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  months: {
    type: Number,
    required: true
  },user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
});

module.exports = mongoose.model("Goal", goalSchema);