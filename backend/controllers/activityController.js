const ActivityModel = require("../models/ActivityModel"); // Assuming you have a model for activities

// Fetch recent activities
const getRecentActivities = async (req, res) => {
  try {
    // Fetch the latest 5 activities sorted by timestamp
    const activities = await ActivityModel.find()
      .sort({ timestamp: -1 })
      .limit(5);

    // Send the activities as a response
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ message: "Failed to fetch recent activities" });
  }
};

module.exports = {
  getRecentActivities,
};