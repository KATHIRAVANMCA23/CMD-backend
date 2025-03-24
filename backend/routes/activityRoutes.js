const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware"); // Optional: Add authentication middleware

// GET /api/recent-activities
router.get("/recent-activities", authMiddleware, activityController.getRecentActivities);

module.exports = router;