const router = require("express").Router();
const Story = require("../models").story;
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

module.exports = router;
