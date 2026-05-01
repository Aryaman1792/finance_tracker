const { Budget, Category } = require('../models');

exports.createOrUpdateBudget = async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;
    
    let budget = await Budget.findOne({
      where: { userId: req.user.id, categoryId, month, year }
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        categoryId,
        amount,
        month,
        year,
        userId: req.user.id
      });
    }

    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      where: { userId: req.user.id },
      include: [{ model: Category, attributes: ['name'] }]
    });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
