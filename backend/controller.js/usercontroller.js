const User = require('../models/user');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error getting profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
};

