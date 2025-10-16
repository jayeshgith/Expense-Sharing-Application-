const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const expenseCtrl = require('../controllers/expenseController');
router.post('/:groupId/expenses', auth, expenseCtrl.createExpenseValidation, expenseCtrl.createExpense);
router.get('/:groupId/expenses', auth, expenseCtrl.listExpenses);
module.exports = router;
