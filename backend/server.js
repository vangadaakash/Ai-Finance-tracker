const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reportRoutes = require("./routes/reportRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

/* Middleware */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ai-finance-tracker-hazel.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* Routes */
app.use("/api/expense", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/report", reportRoutes);

/* Health check (IMPORTANT for Render) */
app.get("/", (req, res) => {
  res.send("AI Finance Tracker Backend is running 🚀");
});

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
