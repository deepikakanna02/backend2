
const User = require('../models/user');


// @desc    Update budget and savings for a user by username
// @route   PUT /api/user/update-budget-savings
// @access  Public (No authentication required)
const updateBudgetAndSavings = async (req, res) => {
  const { userName, budget, savings } = req.body;

  if (!userName || (budget === undefined && savings === undefined)) {
    return res.status(400).json({ message: 'Please provide username, and at least one of budget or savings to update.' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userName },
      { 
        $set: {
          budget: budget !== undefined ? budget : undefined,
          savings: savings !== undefined ? savings : undefined
        }
      },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User budget and savings updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating budget/savings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBudgetFromLastTransaction = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: 'userName is required' });
  }

  try {
    const user = await User.findOne({ userName }).populate('transactions');

    if (!user || user.transactions.length === 0) {
      return res.status(404).json({ message: 'User not found or no transactions' });
    }

    // Get the latest transaction (by createdAt descending)
    const latestTxn = user.transactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    const amountToSubtract = latestTxn.amount;
    const currentBudget = parseFloat(user.budget);
    const newBudget = currentBudget - amountToSubtract;

    // Update and save new budget
    user.budget = newBudget.toFixed(2);
    await user.save();

    res.status(200).json({
      message: 'Budget updated successfully',
      subtracted: amountToSubtract,
      newBudget: user.budget
    });
  } catch (err) {
    console.error('Error updating budget from last txn:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateBudgetAndSavings,
  updateBudgetFromLastTransaction
};
