const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate password length
    if (password.length < 4) {
      return res.status(400).json({
        message: "Password must be at least 4 characters long",
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "You already have an account. Please login.",
        success: false,
      });
    }

    // Hash password and create user
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return res.status(500).json({
          message: "Error generating password salt",
          success: false,
        });
      }

      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            message: "Error hashing password",
            success: false,
          });
        }

        try {
          await userModel.create({ name, email, password: hash });
          res.status(201).json({
            message: "Sign up successful",
            success: true,
          });
        } catch (createError) {
          res.status(500).json({
            message: "Error creating user",
            success: false,
          });
        }
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message, // Include error message for debugging
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ message: "You must have an account", success: false });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          { email: email, userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        // Send token in HTTP-only cookie
        res
          .cookie("token", token, {
            httpOnly: true, // JS can't access this cookie (more secure)
            secure: process.env.NODE_ENV === "production", // send over HTTPS only in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: "Lax", // CSRF protection
          })
          .status(200)
          .json({
            message: "Login success",
            success: true,
          });
      } else {
        res
          .status(403)
          .json({ message: "Incorrect password or email", success: false });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
}

module.exports = {
  login,
  signUp,
};
