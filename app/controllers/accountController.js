const Account = require('../models/account'); // Đường dẫn tới model Account của bạn

// Thêm tài khoản mới cho khách hàng
exports.createAccount = async (req, res) => {
    const { customerId, accountNumber, accountType, balance, currency } = req.body;
    
    try {

      // Kiểm tra số tài khoản đã tồn tại chưa
      const existingAccount = await Account.findOne({ accountNumber });
      if (existingAccount) {
          return res.status(400).json({ message: "Số tài khoản đã tồn tại" });
      }
  
      // Tạo tài khoản mới nếu khách hàng tồn tại
      const newAccount = new Account({
        customerId, // Liên kết với khách hàng
        accountNumber, // Số tài khoản
        accountType, // Loại tài khoản
        balance, // Số dư tài khoản
        currency, // Loại tiền
      });
  
      // Lưu tài khoản mới vào cơ sở dữ liệu
      await newAccount.save();
  
      // Trả về tài khoản mới tạo
      res.status(201).json({
        success: true,
        message: "Tạo tài khoản thành công",
        account: newAccount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo tài khoản",
        error: error.message,
      });
    }
  };

// Lấy danh sách tài khoản với phân trang
exports.getAccountsWithPagination = async (req, res) => {
    const { current = 1, pageSize = 10 } = req.query; // Lấy số trang và số lượng từ query params

    try {
        // Chuyển đổi current và pageSize sang số nguyên
        const currentPage = parseInt(current, 10);
        const limit = parseInt(pageSize, 10);

        // Tính số tài liệu bỏ qua
        const skip = (currentPage - 1) * limit;

        // Lấy danh sách tài khoản với phân trang
        const accounts = await Account.find().skip(skip).limit(limit);

        // Đếm tổng số tài khoản
        const total = await Account.countDocuments();

        res.status(200).json({
            success: true,
            total,            // Tổng số tài khoản
            current: currentPage, // Trang hiện tại
            pageSize: limit,     // Kích thước trang
            accounts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};

// Sửa dữ liệu tài khoản
exports.updateAccount = async (req, res) => {
  const { id } = req.params; // Lấy accountId từ params
  const { accountNumber, accountType, balance, currency } = req.body;

  try {
      // Tìm tài khoản theo ID
      const account = await Account.findById(id);
      if (!account) {
          return res.status(404).json({
              success: false,
              message: 'Tài khoản không tồn tại!',
          });
      }

      // Cập nhật các trường
      account.accountNumber = accountNumber || account.accountNumber;
      account.accountType = accountType || account.accountType;
      account.balance = balance !== undefined ? balance : account.balance;
      account.currency = currency || account.currency;

      // Lưu các thay đổi vào cơ sở dữ liệu
      await account.save();

      res.status(200).json({
          success: true,
          message: 'Cập nhật thông tin tài khoản thành công!',
          account,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Lỗi server!',
          error: error.message,
      });
  }
};


// Xóa tài khoản
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAccount = await Account.findByIdAndDelete(id);

    if (!deletedAccount) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tài khoản", error: error.message });
  }
};

// Lấy tài khoản theo id
exports.getAccountById = async (req, res) => {
    const { id } = req.params; // Lấy accountId từ URL params

    try {
        const account = await Account.findById(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản',
            });
        }

        res.status(200).json({
            success: true,
            account,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};
