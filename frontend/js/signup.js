const { set } = require("mongoose");

function validatePassword(password) {
    if (password.search(/[a-z]/i) < 0) {
        return false;
    }
    if (password.search(/[A-Z]/i) < 0) {
        return false;
    }
    if (password.search(/[!@#$%^&*(),.?":{}|<>]/) < 0) {
        return false;
    }
    return true;
}

function validateForm(
    username,
    usernameInput,
    email,
    emailInput,
    password,
    passwordInput,
    confirmPassword,
    confirmPasswordInput) {

    errorForm = document.getElementById('error-form');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function resetStyles() {
        usernameInput.style.border = '';
        emailInput.style.border = '';
        passwordInput.style.border = '';
        confirmPasswordInput.style.border = '';
        errorForm.textContent = '‎';
    }

    if (!username && !password && !email && !confirmPassword) {
        errorForm.textContent = 'All the fields are required.';
        usernameInput.style.border = '1px solid red';
        emailInput.style.border = '1px solid red';
        passwordInput.style.border = '1px solid red';
        confirmPasswordInput.style.border = '1px solid red';
    } else if (!username) {
        errorForm.textContent = 'Username is required.';
        usernameInput.style.border = '1px solid red';
    } else if (!email) {
        errorForm.textContent = 'Email is required.';
        emailInput.style.border = '1px solid red';
    } else if (email && !emailPattern.test(email)) {
        errorForm.textContent = 'Please enter a valid email address.';
        emailInput.style.border = '1px solid red';
    } else if (!password) {
        errorForm.textContent = 'Password is required.';
        passwordInput.style.border = '1px solid red';
    } else if (password.length < 8) {
        errorForm.textContent = 'Password must be at least 8 characters long.';
        passwordInput.style.border = '1px solid red';
        confirmPasswordInput.style.border = '1px solid red';
    } else if (!validatePassword(password)) {
        errorForm.textContent = 'Password must contain at least one uppercase, one lowercase and one special character.';
        passwordInput.style.border = '1px solid red';
        confirmPasswordInput.style.border = '1px solid red';
    } else if (!confirmPassword) {
        errorForm.textContent = 'Please confirm your password.';
        confirmPasswordInput.style.border = '1px solid red';
    } else if (password !== confirmPassword) {
        errorForm.textContent = 'Passwords do not match.';
        passwordInput.style.border = '1px solid red';
        confirmPasswordInput.style.border = '1px solid red';
    } else {
        return true;
    }
    setTimeout(resetStyles, 3000);
    return false;
}

function signup(event) {

    event.preventDefault();

    let usernameInput = document.getElementById('username');
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let confirmPasswordInput = document.getElementById('confirm-password');
    let errorForm = document.getElementById('error-form');

    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    const valid = validateForm(
        username,
        usernameInput,
        email,
        emailInput,
        password,
        passwordInput,
        confirmPassword,
        confirmPasswordInput
    );

    if (valid) {
        fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password
            }),
        })
            .then(response => {
                if (response.ok) {
                    usernameInput.value = '';
                    emailInput.value = '';
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';
                    window.location.href = '../html/feed.html';
                } else {
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    errorForm.textContent = data.message;
                } else {
                    errorForm.textContent = 'An error occurred. Please try again.';
                }
                setTimeout(() => {
                    errorForm.textContent = '‎';
                }, 3000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

}