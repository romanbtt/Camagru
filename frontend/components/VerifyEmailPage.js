
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

        const response = this.root.querySelector("#response");
        response.innerHTML = "Verifying...";
    }
}

customElements.define('verify-email-page', VerifyEmailPage);