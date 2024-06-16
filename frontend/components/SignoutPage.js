import API from "../services/API.js";

export class SignoutPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            const request = await fetch('components/SignoutPage.css');
            const css = await request.text();
            styles.textContent = css;
        }
        loadCSS();
    }

    async connectedCallback() {

        const { ok, data } = await API.signout();
        console.log("ok", ok);
        console.log("data", data);

        if (ok) {
            app.store.myUser = null;
            app.store.isSignedIn = false;
            localStorage.removeItem('authToken');
            localStorage.removeItem('authTokenExpiresAt');
        }
    }
}

customElements.define('signout-page', SignoutPage);
