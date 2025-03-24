const UserStaff = require('../models/User'); 
const ActivityModel = require("../models/ActivityModel"); // Or use Admin/Engineer models as required
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and Password are required.' });
  }

  try {
    // Find user by email
    const user = await UserStaff.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Compare password with the hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Create and assign a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Secret key from environment variable
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,  // Send the JWT token back to the client
        role: user.role,  // Make sure the role is being sent in the response
        name: user.name,
        email: user.email,
        id: user._id
      });
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


// Register user (Lab Staff)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await UserStaff.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = new UserStaff({
      name,
      email,
      password,
      role,
    });

    const activity = new ActivityModel({
      action: `New user registered: ${name}`,
      userId: user._id,
    });
    await activity.save();

    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;  // The ID is passed via URL params

  try {
    // Find the user by ID
    const user = await UserStaff.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await UserStaff.find({ role: "Student" });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

exports.getEngineers = async (req, res) => {
  try {
    
    const engineers = await UserStaff.find({ role: "HOD" }).select("_id name email");
    
    res.status(200).json({ success: true, engineers });
  } catch (error) {
    console.error("Error fetching engineers:", error);
    res.status(500).json({ success: false, message: "Error fetching engineers." });
  }
};

//Get all engineer for Admin view
exports.getAllEngineer = async (req, res) => {
  try {
    // Find all users
    const users = await UserStaff.find({ role: "HOD" });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};
