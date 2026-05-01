const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER, // e.g., 1-12
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER, // e.g., 2024
    allowNull: false,
  },
});

module.exports = Budget;
