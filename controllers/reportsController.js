const { Transaction, Category } = require('../models');
const { Op } = require('sequelize');

exports.generateMonthlyReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    // JS Date is 0-indexed for month, so month - 1
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // last day of the month

    const transactions = await Transaction.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      include: [{ model: Category, attributes: ['name', 'type'] }],
      order: [['date', 'ASC']]
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      const amt = parseFloat(t.amount);
      if (t.type === 'INCOME') totalIncome += amt;
      if (t.type === 'EXPENSE') totalExpense += amt;
    });

    res.json({
      period: { month, year },
      summary: {
        totalIncome,
        totalExpense,
        savings: totalIncome - totalExpense
      },
      transactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
