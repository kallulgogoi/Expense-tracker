//external
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
//local
const db = require("./models/db");
const authRouter = require("./routes/authRouter");
const transaction = require("./routes/transactions");
//set-up
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend port
    credentials: true, // allow cookies to be sent
  })
);
app.use(cookieParser());
//routes
app.use("/api/transaction", transaction);
app.use("/api/auth", authRouter);

//server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
