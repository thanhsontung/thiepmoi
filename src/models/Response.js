const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    // --- THÔNG TIN PHẢN HỒI ---
    senderName: { // Tên người gửi lời chúc
        type: String,
        required: true, // Yêu cầu nhập tên người gửi
        trim: true
    },
    relationship: { // Mối quan hệ với Dâu/Rể
        type: String,
        trim: true,
        default: ''
    },
    message: { // Lời chúc
        type: String,
        default: ''
    },
    rsvp: { // Trạng thái xác nhận tham dự
        type: String,
        enum: ['yes', 'no', 'pending', 'maybe'],
        default: 'pending' // 'pending' là trạng thái ban đầu
    },
    numberOfGuests: { // Số người tham dự
        type: Number,
        default: 1,
        min: 0,
        max: 20 // Giới hạn tối đa 20 người
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);