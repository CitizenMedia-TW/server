const mongoose = require("mongoose");
const { Schema } = mongoose;

const storySchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Story", storySchema);
