const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

async function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("_id name email incomes expenses");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
      success: false,
    });
  }
}

module.exports = { isLoggedIn };
