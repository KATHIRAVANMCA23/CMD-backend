const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who performed the action
    required: true,
  },
});

const ActivityModel = mongoose.model("Activity", activitySchema);

module.exports = ActivityModel;