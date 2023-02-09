const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const authRoute = require("./routes").auth;
const storyRoute = require("./routes").story;
const profileRoute = require("./routes").profile;
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/CitizenMediaDB")
  .then(() => console.log("Connecting to MongoDB"))
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/user", authRoute);

// Story routes should be protected by jwt.
// If jwt is not contained in the request header, the request will be seen as unauthorized.
app.use(
  "/api/story",
  passport.authenticate("jwt", { session: false }),
  storyRoute
);

app.use(
  "/api/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoute
);

app.listen(8080, () => {
  console.log("Server listening on port 8080...");
});
