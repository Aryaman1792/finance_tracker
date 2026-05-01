const { Transaction, Category, Budget, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Income & Expenses
    const totals = await Transaction.findAll({
      where: { userId },
      attributes: [
        'type',
        [sequelize.fn('sum', sequelize.col('baseAmount')), 'total']
      ],
      group: ['type']
    });

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach(t => {
      if (t.type === 'INCOME') totalIncome = parseFloat(t.getDataValue('total')) || 0;
      if (t.type === 'EXPENSE') totalExpense = parseFloat(t.getDataValue('total')) || 0;
    });

    const savings = totalIncome - totalExpense;

    // Monthly Data for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Transaction.findAll({
      where: {
        userId,
        date: { [Op.gte]: sixMonthsAgo }
      },
      attributes: [
        [sequelize.fn('date_trunc', 'month', sequelize.col('date')), 'month'],
        'type',
        [sequelize.fn('sum', sequelize.col('baseAmount')), 'total']
      ],
      group: ['month', 'type'],
      order: [[sequelize.fn('date_trunc', 'month', sequelize.col('date')), 'ASC']]
    });

    // Expense by Category
    const expenseByCategory = await Transaction.findAll({
      where: { userId, type: 'EXPENSE' },
      attributes: [
        'categoryId',
        [sequelize.fn('sum', sequelize.col('baseAmount')), 'total']
      ],
      include: [{ model: Category, attributes: ['name'] }],
      group: ['categoryId', 'Category.id', 'Category.name']
    });

    res.json({
      summary: { totalIncome, totalExpense, savings },
      monthlyTrends,
      expenseByCategory
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
