document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Here you would typically send the login credentials to your server
        console.log('Login attempt:', { email, remember });
        // After successful login, redirect to dashboard or home page
        // window.location.href = '/my_project_root/dashboard/dashboard.html';
    });
});