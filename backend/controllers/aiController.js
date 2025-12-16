const axios = require("axios");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

exports.getInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId });

    if (!expenses.length) {
      return res.json({
        title: "No insights yet",
        message: "Add expenses to get AI insights",
        percentage: 0,
        severity: "info"
      });
    }

    /* ---------- SEND DATA TO AI SERVICE ---------- */
    const payload = {
      expenses: expenses.map(e => ({
        category: e.category,
        amount: Number(e.amount),
        date: new Date(e.date).toISOString()
      }))
    };

    const aiRes = await axios.post(
      "http://127.0.0.1:8000/insights",
      payload
    );

    /* ---------- BUDGET AWARE AI ---------- */
    const currentMonth = new Date().toISOString().slice(0, 7);

    const budgets = await Budget.find({
      user: req.userId,
      month: currentMonth
    });

    const budgetMap = {};
    budgets.forEach(b => {
      budgetMap[b.category] = b.limit; // ✅ limit, not amount
    });

    const topCategory = aiRes.data?.topCategory;
    const topAmount = payload.expenses
      .filter(e => e.category === topCategory)
      .reduce((s, e) => s + e.amount, 0);

    const budget = budgetMap[topCategory];

    if (budget) {
      const usage = Math.round((topAmount / budget) * 100);
      aiRes.data.budgetUsage = usage;

      if (usage >= 100) {
        aiRes.data.message += `\n\n🚨 You have exceeded your ${topCategory} budget.`;
        aiRes.data.severity = "danger";
      } else if (usage >= 80) {
        aiRes.data.message += `\n\n⚠️ You’ve used ${usage}% of your ${topCategory} budget.`;
        aiRes.data.severity = "warning";
      }
    }

    res.json(aiRes.data);

  } catch (err) {
    console.error("AI service error:", err.message);
    res.status(500).json({ message: "AI service failed" });
  }
};
