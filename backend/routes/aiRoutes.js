const express = require("express");
const axios = require("axios");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/insights", auth, async (req, res) => {
  try {
    const response = await axios.post(
      "https://ai-finance-tracker-1-f0jw.onrender.com",
      req.body
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("AI Service Error:", error.message);
    res.status(500).json({
      error: "AI service not reachable"
    });
  }
});

module.exports = router;
