document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const passwordStrengthBar = document.getElementById('password-strength-bar');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const registerForm = document.getElementById('register-form');

    passwordInput.addEventListener('input', updatePasswordStrength);

    function updatePasswordStrength() {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);

        // Update the strength bar
        passwordStrengthBar.style.width = `${strength}%`;

        // Update the color of the strength bar
        if (strength < 25) {
            passwordStrengthBar.style.backgroundColor = '#ff4d4d';
            passwordStrengthText.textContent = 'Weak';
        } else if (strength < 50) {
            passwordStrengthBar.style.backgroundColor = '#ffa64d';
            passwordStrengthText.textContent = 'Fair';
        } else if (strength < 75) {
            passwordStrengthBar.style.backgroundColor = '#ffff4d';
            passwordStrengthText.textContent = 'Good';
        } else {
            passwordStrengthBar.style.backgroundColor = '#4dff4d';
            passwordStrengthText.textContent = 'Strong';
        }
    }

    function calculatePasswordStrength(password) {
        let strength = 0;

        // Length check
        if (password.length >= 8) {
            strength += 25;
        }

        // Uppercase letters check
        if (/[A-Z]/.test(password)) {
            strength += 25;
        }

        // Lowercase letters check
        if (/[a-z]/.test(password)) {
            strength += 25;
        }

        // Numbers check
        if (/[0-9]/.test(password)) {
            strength += 25;
        }

        return strength;
    }

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Add your form submission logic here
        console.log('Form submitted');
    });
});
