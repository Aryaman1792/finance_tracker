const { Transaction, Category } = require('../models');

exports.createTransaction = async (req, res) => {
  try {
    const { amount, date, description, type, categoryId } = req.body;
    const newTransaction = await Transaction.create({
      amount,
      date,
      description,
      type,
      categoryId: categoryId || null,
      userId: req.user.id,
    });
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
    const { amount, date, description, type, categoryId } = req.body;
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update({
      amount,
      date,
      description,
      type,
      categoryId: categoryId || null,
    });

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
