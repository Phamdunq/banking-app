const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/accounts', accountController.getAllAccounts);
router.post('/accounts', accountController.createAccount);
router.get('/accounts/:id', accountController.getAccountById);
router.put('/accounts/:id', accountController.updateAccount);
router.delete('/accounts/:id', accountController.deleteAccount);
router.get('/accounts/accountNumber/:accountNumber', accountController.getAccountByAccountNumber);


module.exports = router;
