const Budget = require("../models/Budget");

exports.setBudget = async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, category, month },
      { amount: Number(amount) }, // ✅ CORRECT FIELD
      { upsert: true, new: true }
    );

    res.json(budget);
  } catch (err) {
    console.error("Set budget error:", err.message);
    res.status(500).json({ message: "Failed to set budget" });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
};
