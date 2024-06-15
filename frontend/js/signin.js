// fetch('http://localhost:3000/auth/signin', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         "username": "Johnny89",
//         "password": "u5])vE0yQs)hw%^K+vs*"
//     }),
// })
//     .then(response => {
//         console.log(response);
//         return response.json();
//     })
//     .then(data => {
//         localStorage.setItem('accessToken', data.accessToken);
//         localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         localStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

import { updateMenu, loadPage } from './menu.js';

function validateForm(username, usernameInput, password, passwordInput) {
    errorForm = document.getElementById('error-form');

    function resetStyles() {
        usernameInput.style.border = '';
        passwordInput.style.border = '';
        errorForm.textContent = '';
    }

    if (!username && !password) {
        errorForm.textContent = 'All the fields are required.';
        usernameInput.style.border = '1px solid red';
        passwordInput.style.border = '1px solid red';
    } else if (!username) {
        errorForm.textContent = 'Username is required.';
        usernameInput.style.border = '1px solid red';
    } else if (!password) {
        errorForm.textContent = 'Password is required.';
        passwordInput.style.border = '1px solid red';
    } else {
        return true;
    }

    setTimeout(resetStyles, 3000);
    return false;
}

function signin(event) {

    event.preventDefault();

    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');

    var username = usernameInput.value;
    var password = passwordInput.value;

    const valid = validateForm(username, usernameInput, password, passwordInput);

    if (valid) {
        fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })
            .then(response => {
                if (response.ok) {
                    usernameInput.value = '';
                    passwordInput.value = '';
                    updateMenu(true);
                    loadPage('/html/feed.html')
                } else {
                    usernameInput.value = '';
                    passwordInput.value = '';
                }
                return response.json();
            })
            .then(data => {
                if (data.accessToken && data.refreshToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt);
                }
                if (data.message) {
                    errorForm.textContent = data.message;
                } else {
                    errorForm.textContent = 'An error occurred. Please try again.';
                }
                setTimeout(() => {
                    errorForm.style.color = 'red';
                }, 3000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}