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

    connectedCallback() {
        app.store.myUser = null;
        app.store.isSignedIn = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiresAt');
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure;";
    }
}

customElements.define('signout-page', SignoutPage);
