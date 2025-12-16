const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Budget = require("../models/Budget");

router.post("/set", auth, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    console.log('Budget set request:', { userId: req.userId, category, limit, month });

    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, category, month },
      { limit: Number(limit) }, // ✅ FIX
      { upsert: true, new: true }
    );

    res.json(budget);
  } catch (err) {
    console.error('Budget set error:', err);
    res.status(500).json({ message: "Failed to set budget" });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await Budget.deleteOne({
      _id: req.params.id,
      user: req.userId
    });

    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;
