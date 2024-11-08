const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// API lấy tất cả khách hàng với phân trang
router.get('/customers', customerController.getCustomersWithPagination);
router.post('/customers', customerController.createCustomer);
router.get('/customers/:id', customerController.getCustomerById);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);
router.post('/login', customerController.login);
router.post('/register', customerController.register);
router.get('/search/customers', customerController.searchCustomers)

module.exports = router;
