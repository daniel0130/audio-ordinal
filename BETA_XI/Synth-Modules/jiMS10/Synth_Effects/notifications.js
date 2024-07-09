// notification.js

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide the notification after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        // Remove the notification from the DOM after it fades out
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}
