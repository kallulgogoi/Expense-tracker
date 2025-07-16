const expenseModel = require("../models/expense-model");

async function addExpense(req, res) {
  const { title, amount, date, category, description } = req.body;
  const numAmount = Number(amount);

  try {
    if (!title || amount === undefined || !date || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a valid, positive number",
      });
    }

    const expense = await expenseModel.create({
      title,
      amount: -Math.abs(numAmount),
      date,
      category,
      description,
      userId: req.user._id,
    });

    return res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

async function getExpense(req, res) {
  try {
    const expenses = await expenseModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

async function deleteExpense(req, res) {
  const { id } = req.params;

  try {
    const deleted = await expenseModel.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = { addExpense, getExpense, deleteExpense };
