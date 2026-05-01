const { Category, Transaction } = require('../models');

exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const newCategory = await Category.create({
      name,
      type,
      userId: req.user.id,
    });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
    });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Since onDelete is SET NULL in the relation, deleting this will 
    // simply make existing transactions have categoryId = null,
    // protecting historical transaction data while removing the category.
    await category.destroy();
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
