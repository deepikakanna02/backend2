const User = require('../models/user');
const userController = require('../controllers/usercontroller');

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

// @desc    Add a transaction from SMS
// @route   POST /api/user/sms
// @access  Private
const addTransactionFromSms = async (req, res) => {
  try {
    const { sms } = req.body;
    const userId = req.user.id; // Get from auth middleware

    const updatedUser = await User.addTransactionFromSms(userId, sms);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error adding SMS transaction:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getUserProfile,
  addTransactionFromSms,
};
