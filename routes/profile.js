const router = require("express").Router();
const Story = require("../models").story;
const User = require("../models").user;
// const profileValidation = require("../validation").profileValidation;

router.use((req, res, next) => {
  console.log("profile route is getting request...");
  next();
});

router.get("/", (req, res) => {
  res.send(req.user);
});

router.get("/my-stories", async (req, res) => {
  try {
    let storyFound = await Story.find({ author: req.user._id }).exec();
    res.send(storyFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.post("/like-story", async (req, res) => {
  try {
    // ObjectId.valueOf() -> Return value of the ObjectID() as a lowercase hexadecimal string.
    let likedStoryID = req.body.likedStoryID.valueOf();
    const id = req.user._id;
    let likeBefore = await User.countDocuments({
      _id: id,
      like: { $in: [likedStoryID] },
    }).exec();

    if (likeBefore === 1) {
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { like: likedStoryID } },
        {
          returnOriginal: false,
        }
      ).exec();
      return res.send("Like before, unlike success");
    } else {
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { like: likedStoryID } },
        {
          returnOriginal: false,
        }
      ).exec();
      return res.status(200).send("Like success");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
