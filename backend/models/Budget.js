const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      required: true
    },
    month: {
      type: String, // YYYY-MM
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate budgets for same category & month
budgetSchema.index(
  { user: 1, category: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
