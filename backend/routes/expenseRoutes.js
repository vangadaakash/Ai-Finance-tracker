const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses
} = require("../controllers/expenseController");

router.post("/add", auth, addExpense);
router.get("/all", auth, getExpenses);

module.exports = router;
