const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: false },  // Liên kết với tài khoản
  transactionType: { type: String, enum: ['Deposit', 'Withdraw', 'Transfer'], required: true }, // Loại giao dịch
  amount: { type: Number, required: true },        // Số tiền giao dịch
  currency: { type: String, required: true, default: 'VND' },  // Loại tiền
  fromAccount: { type: String },  // Số tài khoản gửi (nếu là chuyển khoản)
  toAccount: { type: String },    // Số tài khoản nhận (nếu là chuyển khoản)
  createdAt: { type: Date, default: Date.now },    // Ngày thực hiện giao dịch
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
