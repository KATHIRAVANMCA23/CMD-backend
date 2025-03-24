const LabStaff = require('../models/LabStaff');  // LabStaff model
const User = require('../models/User');  // User model
const ActivityModel = require("../models/ActivityModel");

const reportIssue = async (req, res) => {
  const { department, complaint, description, quickAction } = req.body;

  // Validate the necessary fields
  if (!department || !complaint || !description) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Fetch user to ensure the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Create a new Lab Staff issue report
    const newIssueReport = new LabStaff({
      department,
      complaint,
      description,
      quickAction, // Include quickAction in the report
      userId: req.user.id,
      userName: user.name,  // userId will be assigned from the JWT token via middleware
      email: user.email, // Include the user's email if needed
    });

    // Save the issue report
    await newIssueReport.save();

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully!',
      issueReport: newIssueReport,
    });
  } catch (error) {
    console.error('Error in reportIssue controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error in reporting the issue.',
    });
  }
};

// Get all reported issues
// Fetch all issues and populate assigned engineer's name and email
const getReportedIssues = async (req, res) => {
  try {
    const issues = await LabStaff.find()
      .populate('userId', 'name email')  // Populating userId details
      .populate('assignedEngineer', 'name email')  // Populating assigned engineer details
      .exec();

    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reported issues.',
    });
  }
};


// Get all reported issues with filtering options (optional)
// Get all reported issues with filtering options (optional)
// Get all reported issues with filtering options (optional)
// Fetch all reports with optional filters (department, status)
const getAllReportViews = async (req, res) => {
  try {
    const { department, status } = req.query;
    let query = {};

    if (department) query.department = department;
    if (status) query.status = status;

    const reports = await LabStaff.find(query)
      .populate("userId", "name email")
      .populate("assignedEngineer", "name email")
      .exec();

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving reports.",
    });
  }
};


// Assign an Engineer to a Complaint
const assignEngineer = async (req, res) => {
  const { complaintId, engineerId } = req.body;

  if (!complaintId || !engineerId) {
    return res.status(400).json({ success: false, message: "Complaint ID and Engineer ID are required." });
  }

  try {
    // Verify if the engineer exists
    const engineer = await User.findOne({ _id: engineerId, role: "Network Engineer" });
    if (!engineer) {
      return res.status(404).json({ success: false, message: "Engineer not found." });
    }

    // Update the complaint with the assigned engineer and status
    const updatedComplaint = await LabStaff.findByIdAndUpdate(
      complaintId,
      { assignedEngineer: engineerId, status: "In Progress" },
      { new: true }
    )
      .populate('assignedEngineer', 'name email') // Ensure populated data for assigned engineer
      .exec();

    if (!updatedComplaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Log the activity for assigning an engineer to a complaint
    const activity = new ActivityModel({
      action: `Engineer ${engineer.name} assigned to complaint: ${updatedComplaint.complaint}`,
      userId: updatedComplaint._id, // Log the complaint ID or user ID who performed the action
    });
    await activity.save();

    // Return the updated complaint with assigned engineer details
    res.status(200).json({
      success: true,
      message: "Engineer assigned successfully!",
      updatedComplaint: updatedComplaint, // Return the updated complaint object
    });
  } catch (error) {
    console.error("Error assigning engineer:", error);
    res.status(500).json({ success: false, message: "Error assigning engineer." });
  }
};






const getComplaints = async (req, res) => {
  try {
    const complaints = await LabStaff.find()
      .populate('assignedEngineer', 'name email')  // Populate engineer's name and email
      .exec();

    res.status(200).json({ success: true, complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ success: false, message: "Failed to fetch complaints" });
  }
};


const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    // Ensure the status is valid
    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the report
    const updatedReport = await LabStaff.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating report status",
    });
  }
};





module.exports = { reportIssue, getReportedIssues, getAllReportViews, assignEngineer,getComplaints,updateReportStatus  };