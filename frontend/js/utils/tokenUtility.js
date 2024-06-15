export function isAccessTokenValid() {
    const accessToken = localStorage.getItem('accessToken');
    const accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt');

    if (!accessToken || accessTokenExpiresAt < Math.floor(Date.now() / 1000)) {
        return false;
    }
    return true;
}

export function isRefreshTokenValid() {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenExpiresAt = localStorage.getItem('refreshTokenExpiresAt');

    if (!refreshToken || refreshTokenExpiresAt < Math.floor(Date.now() / 1000)) {
        return false;
    }
    return true;
}

export function isSignedIn() {
    const signedIn = isAccessTokenValid() || isRefreshTokenValid();

    if (!signedIn) {
        signOut();
    }
    return signedIn;
}

export function signOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiresAt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiresAt');
}

export function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refreshToken: refreshToken
        }),
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
