const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },       // Họ và tên khách hàng
  email: { type: String, required: true, unique: true },          // Email khách hàng là duy nhất
  phoneNumber: { type: String, required: true, unique: true },    // Số điện thoại là duy nhất
  password: { type: String, required: true },        //mật khẩu
  address: { type: String, required: true },        // Địa chỉ
  dateOfBirth: { type: Date, required: true },      // Ngày sinh
  image: { type: String, required: false },        // Đường dẫn tới ảnh của khách hàng
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
