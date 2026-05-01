const { Transaction, Category, User, Budget, sequelize } = require('../models');
const { getExchangeRate } = require('../utils/currency');
const { sendNotification } = require('../utils/email');


exports.createTransaction = async (req, res) => {
  try {
    const { amount, date, description, type, categoryId, currency = 'USD' } = req.body;
    
    // Get user to know base currency
    const user = await User.findByPk(req.user.id);
    const rate = await getExchangeRate(currency, user.baseCurrency);
    const baseAmount = amount * rate;

    const newTransaction = await Transaction.create({
      amount,
      currency,
      baseAmount,
      date,
      description,
      type,
      categoryId: categoryId || null,
      userId: req.user.id,
      receiptUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
    
    // Budget Overrun check
    if (type === 'EXPENSE' && categoryId) {
      const txDate = new Date(date);
      const month = txDate.getMonth() + 1; // 1-12
      const year = txDate.getFullYear();

      const budget = await Budget.findOne({
        where: { userId: req.user.id, categoryId, month, year }
      });

      if (budget && !budget.overrunNotified) {
        // Calculate total expenses for this category this month
        const totalExpenseResult = await Transaction.findAll({
          where: { userId: req.user.id, categoryId, type: 'EXPENSE' },
          attributes: [[sequelize.fn('sum', sequelize.col('baseAmount')), 'total']]
        });
        
        const totalExpense = parseFloat(totalExpenseResult[0].getDataValue('total')) || 0;

        if (totalExpense > budget.amount) {
          const category = await Category.findByPk(categoryId);
          const msg = `Alert! You have exceeded your budget of ${budget.amount} for ${category.name} in month ${month}/${year}. Current expenses: ${totalExpense}`;
          
          // Send Email
          await sendNotification(user.email, 'Budget Overrun Alert', msg);
          
          // Update budget so we don't spam
          budget.overrunNotified = true;
          await budget.save();
        }
      }
    }

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      include: [{ model: Category, attributes: ['name', 'type'] }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { amount, date, description, type, categoryId, currency } = req.body;
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    let newBaseAmount = transaction.baseAmount;
    let newCurrency = currency || transaction.currency;
    let newAmount = amount || transaction.amount;

    if (amount || currency) {
      const user = await User.findByPk(req.user.id);
      const rate = await getExchangeRate(newCurrency, user.baseCurrency);
      newBaseAmount = newAmount * rate;
    }

    const updateData = {
      amount: newAmount,
      currency: newCurrency,
      baseAmount: newBaseAmount,
      date,
      description,
      type,
      categoryId: categoryId || null,
    };

    if (req.file) {
      updateData.receiptUrl = `/uploads/${req.file.filename}`;
    }

    await transaction.update(updateData);

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
