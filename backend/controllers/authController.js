const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and Password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

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
