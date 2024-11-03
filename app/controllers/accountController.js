const Account = require('../models/account');

exports.getAllAccounts = async (req, res) => {
    try {
        // Lấy tất cả tài khoản từ cơ sở dữ liệu
        const accounts = await Account.find().populate('customerId', 'fullName email'); // Populates customerId with customer information

        res.status(200).json({
            success: true,
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

exports.createAccount = async (req, res) => {
    const { customerId, accountNumber, accountType, balance, currency } = req.body;

    try {
        // Tạo mới tài khoản
        const newAccount = new Account({
            customerId,
            accountNumber,
            accountType,
            balance,
            currency,
        });

        // Lưu tài khoản vào cơ sở dữ liệu
        await newAccount.save();

        res.status(201).json({
            success: true,
            message: 'Tạo mới tài khoản thành công!',
            account: newAccount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message
        });
    }
};

exports.getAccountById = async (req, res) => {
    const { id } = req.params; // Lấy accountId từ params

    try {
        // Tìm tài khoản theo ID
        const account = await Account.findById(id).populate('customerId', 'fullName email'); // Populates customerId with customer information
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Tài khoản không tồn tại!',
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
        account.balance = balance !== undefined ? balance : account.balance; // Kiểm tra nếu balance có giá trị mới
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

exports.deleteAccount = async (req, res) => {
    const { id } = req.params; // Lấy accountId từ params

    try {
        // Tìm và xóa tài khoản theo ID
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Tài khoản không tồn tại!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa tài khoản thành công!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};

// API tìm kiếm tài khoản theo số tài khoản
exports.getAccountByAccountNumber = async (req, res) => {
    const { accountNumber } = req.params; // Lấy accountNumber từ params

    try {
        // Tìm tài khoản theo số tài khoản
        const account = await Account.findOne({ accountNumber }).populate('customerId', 'fullName email'); // Populates customerId with customer information
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Tài khoản không tồn tại!',
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
