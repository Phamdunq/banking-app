const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Tạo tài khoản mới
router.post('/accounts', accountController.createAccount);

// Lấy danh sách tài khoản (có phân trang)
router.get('/accounts', accountController.getAccountsWithPagination);

// Lấy tài khoản theo id
router.get('/accounts/:id', accountController.getAccountById);

// Cập nhật tài khoản
router.put('/accounts/:id', accountController.updateAccount);

// Xóa tài khoản
router.delete('/accounts/:id', accountController.deleteAccount);

module.exports = router;
