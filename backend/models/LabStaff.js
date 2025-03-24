const mongoose = require("mongoose");

const LabStaffSchema = new mongoose.Schema(
  {
    department: { type: String, required: true },
    complaint: { type: String, required: true },
    description: { type: String, required: true },
    quickAction: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User who raised complaint
    assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Reference to Engineer (User)
    status: { type: String, default: "Pending" }, // Status field
  },
  { timestamps: true }
);

// This makes the 'assignedEngineer' populated with the engineer's details when fetching.
LabStaffSchema.methods.populateAssignedEngineer = function () {
  return this.populate('assignedEngineer', 'name email');
};

module.exports = mongoose.model("LabStaff", LabStaffSchema);
