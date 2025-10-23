document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submissionForm');
    const responseMessage = document.getElementById('responseMessage');
    const submitBtn = document.getElementById('submitBtn');
    const attendanceSelect = document.getElementById('attendance');
    const numberOfGuestsSelect = document.getElementById('numberOfGuests');
    const guestCountGroup = document.getElementById('guestCountGroup');

    // Xử lý hiển thị/ẩn và tự động chọn số người dựa trên trạng thái tham dự
    if (attendanceSelect && numberOfGuestsSelect) {
        attendanceSelect.addEventListener('change', (e) => {
            const attendance = e.target.value;

            if (attendance === 'no') {
                // Nếu không tham dự, tự động chọn 0 người và disable select
                numberOfGuestsSelect.value = '0';
                numberOfGuestsSelect.disabled = true;
                guestCountGroup.style.opacity = '0.5';
            } else if (attendance === 'yes' || attendance === 'maybe') {
                // Nếu có tham dự hoặc có thể, enable select và chọn mặc định 1 người
                numberOfGuestsSelect.disabled = false;
                guestCountGroup.style.opacity = '1';
                if (numberOfGuestsSelect.value === '0' || numberOfGuestsSelect.value === '') {
                    numberOfGuestsSelect.value = '1';
                }
            } else {
                // Chưa chọn trạng thái
                numberOfGuestsSelect.disabled = false;
                guestCountGroup.style.opacity = '1';
                numberOfGuestsSelect.value = '';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // NGĂN TẢI LẠI TRANG

            responseMessage.textContent = 'Đang gửi phản hồi...';
            responseMessage.style.backgroundColor = '#cfe2ff';
            responseMessage.style.color = '#084298';
            responseMessage.classList.remove('hidden');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/submit-response', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                // Xử lý kết quả trả về
                if (result.success) {
                    // Chuyển hướng đến trang cảm ơn với tên khách
                    window.location.href = `/thank-you?name=${encodeURIComponent(result.senderName)}`;
                } else {
                    responseMessage.textContent = result.message || 'Gửi thất bại. Vui lòng thử lại.';
                    responseMessage.style.backgroundColor = '#f8d7da';
                    responseMessage.style.color = '#721c24';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Lỗi mạng/server:', error);
                responseMessage.textContent = 'Lỗi kết nối Server. Vui lòng kiểm tra lại đường truyền.';
                responseMessage.style.backgroundColor = '#f8d7da';
                responseMessage.style.color = '#721c24';
                submitBtn.disabled = false;
            }
        });
    }
});