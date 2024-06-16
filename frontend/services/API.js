function setAuthToken(token) {
    localStorage.setItem("authToken", token.authToken);
    localStorage.setItem("authTokenExpiresAt", token.authTokenExpiresAt);
}

function getAuthToken() {
    return localStorage.getItem("authToken");
}

const API = {
    request: async function (url, method, body = null, addAuth = true) {
        let headers = {};

        method === "POST" ? headers['Content-Type'] = 'application/json' : null;
        addAuth ? headers['Authorization'] = `Bearer ${getAuthToken()}` : null;

        const response = await fetch(url, {
            method,
            headers,
            body,
            credentials: "include"
        });

        const data = await response.json();

        if (response.status === 401) {
            setAuthToken({ authToken: null, authTokenExpiresAt: null });
        }

        if (data.authToken && data.authTokenExpiresAt) {
            setAuthToken({ authToken: data.authToken, authTokenExpiresAt: data.authTokenExpiresAt });
        }

        return { ok: response.ok, data };
    },
    fetchStickers: async function () {
        const { ok, data } = await this.request(
            "http://localhost:3000/api/public/stickers/all",
            "GET",
            null,
            false
        );
        return { ok, data };
    },
    signin: async function ({ usernameOrEmail, password }) {
        const { ok, data } = await this.request(
            "http://localhost:3000/api/public/signin",
            "POST",
            JSON.stringify({ usernameOrEmail, password }),
            false
        );

        return { ok, data };
    },
    signup: async function ({ username, email, password }) {
        const { ok, data } = await this.request(
            "http://localhost:3000/api/public/signup",
            "POST",
            JSON.stringify({ username, email, password }),
            false
        );
        return { ok, data };
    },
    signout: async function () {
        const { ok, data } = await this.request(
            "http://localhost:3000/api/private/signout",
            "POST"
        );

        return { ok, data };
    },
    authentificate: async function () {
        const { ok, data } = await this.request(
            "http://localhost:3000/api/secure/authentificate",
            "GET"
        );

        return { ok, data };
    },
    getPicturesByPage: async function (page, userId) {
        console.log("page", page);
        const { ok, data } = await this.request(
            `http://localhost:3000/api/public/pictures/${page}${userId ? "/" + userId : ""}`,
            "GET",
            null,
            false
        );

        return { ok, data };
    }
}

export default API;