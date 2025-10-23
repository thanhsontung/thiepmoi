// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Response = require('./src/models/Response');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/views')));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB đã kết nối thành công!');
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err.message);
        process.exit(1); // Thoát ứng dụng nếu kết nối lỗi
    }
};

// Gọi hàm kết nối
connectDB();

// Route trang chủ - hiển thị thiệp mời (HTML tĩnh)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'index.html'));
});

// Route trang cảm ơn (HTML tĩnh - tên khách được truyền qua query param)
app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'thank_you.html'));
});

// Route xử lý gửi phản hồi
app.post('/api/submit-response', async (req, res) => {
    try {
        const { senderName, relationship, message, attendance, numberOfGuests } = req.body;

        // Kiểm tra xem có dữ liệu bắt buộc không
        if (!senderName || !attendance || !numberOfGuests) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
        }

        // Tạo response mới
        const newResponse = new Response({
            senderName,
            relationship,
            message,
            rsvp: attendance,
            numberOfGuests: parseInt(numberOfGuests)
        });

        // Lưu vào database
        await newResponse.save();

        res.status(200).json({
            success: true,
            message: 'Phản hồi và Lời chúc đã được lưu thành công!',
            senderName: senderName
        });

    } catch (err) {
        console.error('Lỗi khi gửi phản hồi:', err);
        res.status(500).json({ success: false, message: 'Lỗi Server. Vui lòng thử lại sau.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

