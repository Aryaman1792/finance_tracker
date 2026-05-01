const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/monthly', reportsController.generateMonthlyReport);

module.exports = router;
