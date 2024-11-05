// app.js
const { enrollAdmin } = require('./blockchain/enrollAdmin'); // Gọi hàm đăng ký admin
const { registerUser } = require('./blockchain/registerUser'); // Gọi hàm đăng ký người dùng

// Hàm main để thực hiện đăng ký
async function main() {
    await enrollAdmin(); // Đăng ký admin trước
    await registerUser('newUserID'); // Thay thế 'newUserID' bằng ID người dùng thực tế
}

main().catch(console.error); // Thực hiện và bắt lỗi nếu có
