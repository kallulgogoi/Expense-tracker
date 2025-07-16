const express = require("express");
const { addIncome, getIncome, deleteIncome } = require("../controllers/Income");
const {
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/Expense");
const { isLoggedIn } = require("../middlewears/isLoggedIn");

const router = express.Router();

router
  .post("/add-incomes", isLoggedIn, addIncome)
  .get("/get-incomes", isLoggedIn, getIncome)
  .delete("/delete-incomes/:id", isLoggedIn, deleteIncome)
  .post("/add-expenses", isLoggedIn, addExpense)
  .get("/get-expenses", isLoggedIn, getExpense)
  .delete("/delete-expenses/:id", isLoggedIn, deleteExpense);

module.exports = router;
