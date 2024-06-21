import API from "../services/API.js";

export class VerifyEmailPage extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!VerifyEmailPage.cssText) {
                const request = await fetch('components/VerifyEmailPage.css');
                VerifyEmailPage.cssText = await request.text();

            }
            styles.textContent = VerifyEmailPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('verify-email-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);

        const token = this.dataset.token;

        const response = this.root.querySelector("#response");
        const { ok, data } = await API.verifyEmail(token);

        response.innerHTML = data.message;

        if (ok) {
            setTimeout(() => {
                app.router.go("/signin", true);
            }, 3000);
        }
    }
}

customElements.define('verify-email-page', VerifyEmailPage);