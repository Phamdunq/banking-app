require('dotenv').config();
const mongoose = require('mongoose');

// Định nghĩa trạng thái kết nối
const dbState = [
    { value: 0, label: "Disconnected" },
    { value: 1, label: "Connected" },
    { value: 2, label: "Connecting" },
    { value: 3, label: "Disconnecting" }
];

const connection = async () => {
    // Tùy chọn kết nối sử dụng biến môi trường
    const options = {
        dbName: process.env.DB_NAME
    };

    try {
        // Kết nối đến MongoDB
        await mongoose.connect(process.env.DB_HOST, options);
        const state = Number(mongoose.connection.readyState);
        console.log(dbState.find(f => f.value === state).label, "to database"); // Đã kết nối đến database
    } catch (error) {
        console.error('Kết nối đến MongoDB thất bại:', error.message);
    }
};

module.exports = connection;
