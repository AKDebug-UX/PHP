// ...existing code...
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-btn');

    hamburgerBtn.addEventListener('click', function () {
        sidebar.classList.add('active');
    });

    closeBtn.addEventListener('click', function () {
        sidebar.classList.remove('active');
    });

    // Optional: close sidebar when clicking outside
    window.addEventListener('click', function (e) {
        if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== hamburgerBtn) {
            sidebar.classList.remove('active');
        }
    });
});
// ...existing code...