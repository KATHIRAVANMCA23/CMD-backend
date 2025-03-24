const Issue = require("../models/Issue");

// Fetch all reported issues
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("userId", "name email");
    res.json({ issues });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

// Update issue status to "Resolved"
const updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Resolved", "In Progress"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    res.json({ message: "Issue status updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Failed to update issue status", error: error.message });
  }
};

module.exports = {
  getAllIssues,
  updateIssueStatus,
};
