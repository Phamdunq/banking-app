const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route để lấy danh sách giao dịch với phân trang
router.get('/transactions', transactionController.getTransactionsWithPagination)
router.post('/transactions', transactionController.createTransaction)
router.delete('/transactions/:id', transactionController.deleteTransaction);
module.exports = router;
