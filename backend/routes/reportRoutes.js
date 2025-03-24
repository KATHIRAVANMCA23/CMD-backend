const express = require("express");
const router = express.Router();
const { reportIssue, getReportedIssues, getAllReportViews, assignEngineer,updateReportStatus } = require("../controllers/reportController");
const protect = require("../middleware/authMiddleware");

// Protected Routes
router.post("/report-issue", protect, reportIssue);
router.get("/reported-issues", protect, getReportedIssues);
router.get("/reports", getAllReportViews);
router.post("/assign-engineer", protect, assignEngineer);
// Update report status
router.put("/reports/:reportId/status", protect, updateReportStatus);


module.exports = router;
