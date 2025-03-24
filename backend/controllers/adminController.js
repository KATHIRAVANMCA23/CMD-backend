const Admin = require('../models/Admin');  // Or use Admin/Engineer models as required

// Register user (Lab Staff)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await Admin.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = new Admin({
      name,
      email,
      password,
      role,
    });

    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};
exports.getAdminById = async (req, res) => {
  const userId = req.params.id;  // The ID is passed via URL params

  try {
    // Find the user by ID
    const user = await Admin.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};