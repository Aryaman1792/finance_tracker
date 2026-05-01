const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', budgetController.createOrUpdateBudget);
router.get('/', budgetController.getBudgets);

module.exports = router;
