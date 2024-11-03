const Transaction = require('../models/transaction');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTransaction = async (req, res) => {
    const transaction = new Transaction({
        accountId: req.body.accountId,
        transactionType: req.body.transactionType,
        amount: req.body.amount,
        currency: req.body.currency,
        fromAccount: req.body.fromAccount,
        toAccount: req.body.toAccount,
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
