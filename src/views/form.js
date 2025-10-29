document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        senderName: document.getElementById('senderName').value,
        relationship: document.getElementById('relationship').value,
        attendance: document.getElementById('attendance').value,
        numberOfGuests: document.getElementById('numberOfGuests').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/api/submit-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = `/thank-you?name=${encodeURIComponent(formData.senderName)}`;
        } else {
            alert(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
});