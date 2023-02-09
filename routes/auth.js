const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("Receiving auth request...");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("Successfully connect to auth route...");
});

router.post("/register", async (req, res) => {
  // Check if data is valid
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email is registered
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email has been registered...");

  // Generate new user
  let { email, username, password } = req.body;
  let newUser = new User({ email, username, password });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "User saved succeddfully",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("Cannot save user");
  }
});

router.post("/login", async (req, res) => {
  // Check if data is valid
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email is registered
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res
      .status(401)
      .send("Cannot find user, please check if the mail is correct");
  }

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // Generate json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "Login succeed",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("Password mismatch");
    }
  });
});

module.exports = router;
