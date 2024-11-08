const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false }, // Liên kết với khách hàng
  accountNumber: { type: String, required: true, unique: true },   // Số tài khoản
  accountType: { type: String, enum: ['Saving', 'Current'], required: true },  // Loại tài khoản: Tiết kiệm hoặc thanh toán
  balance: { type: Number, required: true, default: 0 },           // Số dư tài khoản
  currency: { type: String, required: true, default: 'VND' },      // Loại tiền (mặc định là VND)
  createdAt: { type: Date, default: Date.now },                    // Ngày mở tài khoản
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
