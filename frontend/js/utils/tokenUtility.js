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
}
