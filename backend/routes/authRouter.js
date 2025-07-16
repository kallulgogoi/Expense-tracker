// external
const express = require("express");
const router = express.Router();

// local
const {
  signInValidation,
  signUpValidation,
} = require("../middlewears/authValidation");
const { login, signUp } = require("../controllers/authControllers");
const { isLoggedIn } = require("../middlewears/isLoggedIn");

// Routes
router.post("/login", signInValidation, login);
router.post("/signup", signUpValidation, signUp);
router.post("/logout", isLoggedIn, (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// ✅ Add verify route for checking login status
router.get("/verify", isLoggedIn, (req, res) => {
  // If this runs, the user is authenticated
  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user, // this will include user info from JWT
  });
});

module.exports = router;
