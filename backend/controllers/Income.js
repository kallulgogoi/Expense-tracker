const incomeModel = require("../models/income-model");

async function addIncome(req, res) {
  const { title, amount, date, category, description } = req.body;
  const numAmount = Number(amount);

  try {
    if (!title || amount === undefined || !date || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({
        message: "Amount must be a valid, non-negative number",
      });
    }

    const income = await incomeModel.create({
      title,
      amount: numAmount,
      date,
      category,
      description,
      userId: req.user._id,
    });

    return res.status(201).json(income);
  } catch (err) {
    console.error("Error adding income:", err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

async function getIncome(req, res) {
  try {
    const incomes = await incomeModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

async function deleteIncome(req, res) {
  const { id } = req.params;

  try {
    const deleted = await incomeModel.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = { addIncome, getIncome, deleteIncome };
