const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { exportReport } = require("../controllers/reportController");

router.get("/export", auth, exportReport);

module.exports = router;
