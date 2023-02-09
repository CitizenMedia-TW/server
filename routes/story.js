const router = require("express").Router();
const Story = require("../models").story;
const storyValidation = require("../validation").storyValidation;

router.use((req, res, next) => {
  console.log("story route is getting request...");
  next();
});

router.get("/", (req, res) => {
  res.send(req.user);
});

router.post("/", async (req, res) => {
  // Check if data is valid
  let { error } = storyValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, story, description } = req.body;
  try {
    let newStory = new Story({
      title,
      story,
      description,
      author: req.user._id,
    });
    let savedStory = await newStory.save();
    return res
      .status(200)
      .send({ message: "Story saved successfully", savedStory });
  } catch (e) {
    return res.status(500).send("Cannot create story");
  }
});

// router.get("/findAuthor/:name", async (req, res) => {
//   let { name } = req.params;
//   try {
//     let authorFound = await Story.find({ username: name }).exec();
//     return res.send(authorFound);
//   } catch (e) {
//     return res.status(500).send(e);
//   }
// });

module.exports = router;
