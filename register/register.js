document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic password validation
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Passwords do not match!');
            return;
        }

        if (passwordInput.value.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        // Here you would typically send the form data to your server
        console.log('Form submitted successfully');
        // Redirect to login page after successful signup
        // window.location.href = '/my_project_root/login/login.html';
    });
});
