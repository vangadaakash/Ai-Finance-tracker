const Expense = require("../models/Expense");
const axios = require("axios");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    const expense = new Expense({
      user: req.userId,          // ✅ attach user
      amount,
      description,
      category,
      date
    });

    await expense.save();
    res.status(201).json(expense);

  } catch (err) {
    console.error("Add expense error:", err.message);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId })
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};
