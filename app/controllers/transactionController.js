const Transaction = require('../models/transaction');
const Account = require('../models/account');

// Lấy danh sách giao dịch với phân trang
exports.getTransactionsWithPagination = async (req, res) => {
    const { current = 1, pageSize = 10 } = req.query; // Lấy số trang và kích thước trang từ query params

    try {
        // Chuyển đổi current và pageSize sang số nguyên
        const currentPage = parseInt(current, 10);
        const limit = parseInt(pageSize, 10);

        // Tính số tài liệu cần bỏ qua
        const skip = (currentPage - 1) * limit;

        // Lấy danh sách giao dịch với phân trang
        const transactions = await Transaction.find().skip(skip).limit(limit);

        // Đếm tổng số giao dịch
        const total = await Transaction.countDocuments();

        res.status(200).json({
            success: true,
            total, // Tổng số giao dịch
            current: currentPage, // Trang hiện tại
            pageSize: limit, // Kích thước trang
            transactions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};

// // Thêm mới giao dịch
// exports.createTransaction = async (req, res) => {
//     const { accountId, transactionType, amount, currency, fromAccount, toAccount } = req.body;

//     try {
//         // Kiểm tra xem tài khoản có tồn tại không
//         const account = await Account.findById(accountId);
//         if (!account) {
//             return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });
//         }

//         // Kiểm tra loại giao dịch và số dư (nếu là rút tiền hoặc chuyển khoản)
//         if (transactionType === 'Withdraw' || transactionType === 'Transfer') {
//             if (account.balance < amount) {
//                 return res.status(400).json({ success: false, message: "Số dư không đủ để thực hiện giao dịch" });
//             }
//         }

//         // Tạo mới một giao dịch
//         const newTransaction = new Transaction({
//             accountId,
//             transactionType,
//             amount,
//             currency: currency || 'VND', // Nếu không có loại tiền, mặc định là 'VND'
//             fromAccount: transactionType === 'Transfer' ? fromAccount : null,
//             toAccount: transactionType === 'Transfer' ? toAccount : null,
//         });

//         // Lưu giao dịch vào cơ sở dữ liệu
//         await newTransaction.save();

//         // Cập nhật số dư tài khoản sau giao dịch
//         if (transactionType === 'Deposit') {
//             account.balance += amount;
//         } else if (transactionType === 'Withdraw') {
//             account.balance -= amount;
//         } else if (transactionType === 'Transfer') {
//             account.balance -= amount;
//         }
//         await account.save();

//         // Trả về thông tin giao dịch mới
//         res.status(201).json({
//             success: true,
//             message: "Giao dịch thành công",
//             transaction: newTransaction,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Lỗi khi thực hiện giao dịch",
//             error: error.message,
//         });
//     }
// };

exports.createTransaction = async (req, res) => {
    try {
        const { accountId, transactionType, amount, currency, fromAccount, toAccount } = req.body;

        // Tạo mới giao dịch
        const newTransaction = new Transaction({
            accountId, 
            transactionType, 
            amount, 
            currency, 
            fromAccount, 
            toAccount
        });

        // Lưu vào cơ sở dữ liệu
        await newTransaction.save();

        res.status(201).json({
            success: true,
            message: 'Tạo mới giao dịch thành công!',
            transaction: newTransaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params
    try {
        // Tìm và xóa khách hàng theo ID
        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'giao dịch này không tồn tại!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa giao dịch thành công!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }

}






