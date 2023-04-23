const mongoose = require("mongoose");
const { Schema } = mongoose;

// Issue: 圖片、按讚數、Story's url
// Issue: story 與 description 的差別

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
