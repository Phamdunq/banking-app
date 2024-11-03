const Customer = require('../models/customer');
const Account = require('../models/account')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// API xử lý đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại!' });
        }

        // So sánh mật khẩu không mã hóa với mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Sai mật khẩu!' });
        }

        // Tạo token JWT
        const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ success: true, token });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server!', error });
    }
};

// API xử lý đăng ký
exports.register = async (req, res) => {
    const { fullName, email, phoneNumber, dateOfBirth, password, address } = req.body;

    try {
        // Kiểm tra xem số điện thoại hoặc email đã tồn tại hay chưa
        const existingCustomer = await Customer.findOne({ $or: [{ phoneNumber }, { email }] });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: 'Số điện thoại hoặc email đã tồn tại!' });
        }

        // Tạo mới khách hàng
        const newCustomer = new Customer({
            fullName,
            email,
            phoneNumber,
            dateOfBirth,
            password,
            address,
        });

        await newCustomer.save();

        // Tạo tài khoản cho khách hàng
        const accountNumber = `ACC${newCustomer._id}`; // Tạo số tài khoản đơn giản
        const newAccount = new Account({
            accountNumber,
            customerId: newCustomer._id,
            balance: 0, // Gán số dư ban đầu là 0
        });

        await newAccount.save();
        return res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
};

// API phân trang cho khách hàng 
exports.getCustomersWithPagination = async (req, res) => {
    const { current = 1, pageSize = 10 } = req.query; // Lấy số trang và số lượng từ query params

    try {
        // Chuyển đổi current và pageSize sang số nguyên
        const currentPage = parseInt(current, 10);
        const limit = parseInt(pageSize, 10);

        // Tính số tài liệu bỏ qua
        const skip = (currentPage - 1) * limit;

        // Lấy danh sách khách hàng với phân trang
        const customers = await Customer.find().skip(skip).limit(limit);

        // Đếm tổng số khách hàng
        const total = await Customer.countDocuments();

        res.status(200).json({
            success: true,
            total, // Tổng số khách hàng
            current: currentPage, // Trang hiện tại
            pageSize: limit, // Kích thước trang
            customers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, address, dateOfBirth, image } = req.body;

        // Kiểm tra email và số điện thoại đã tồn tại chưa
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc số điện thoại đã tồn tại!',
            });
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo mới khách hàng
        const newCustomer = new Customer({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,  // Lưu mật khẩu đã mã hóa
            address,
            dateOfBirth,
            image,  // Lưu đường dẫn hình ảnh (nếu có)
        });

        // Lưu vào cơ sở dữ liệu
        await newCustomer.save();

        res.status(201).json({
            success: true,
            message: 'Tạo mới khách hàng thành công!',
            customer: newCustomer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message
        });
    }
            
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        res.json(customer);
    } catch (err) { 
        res.status(500).json({ message: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    const { id } = req.params; // Lấy customerId từ params
    const { fullName, email, phoneNumber, password, address, dateOfBirth, image } = req.body;

    try {
        // Tìm khách hàng theo ID
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Khách hàng không tồn tại!',
            });
        }

        // Cập nhật các trường
        customer.fullName = fullName || customer.fullName;
        customer.email = email || customer.email;
        customer.phoneNumber = phoneNumber || customer.phoneNumber;
        customer.password = password || customer.password; // Lưu mật khẩu thường
        customer.address = address || customer.address;
        customer.dateOfBirth = dateOfBirth || customer.dateOfBirth;
        customer.image = image || customer.image; // Cập nhật hình ảnh (nếu có)

        // Lưu các thay đổi vào cơ sở dữ liệu
        await customer.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin khách hàng thành công!',
            customer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params; // Lấy customerId từ params

    try {
        // Tìm và xóa khách hàng theo ID
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Khách hàng không tồn tại!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa khách hàng thành công!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server!',
            error: error.message,
        });
    }
};
