export class RequestResetPasswordPage extends HTMLElement {

    #dataForm = {
        usernameOrEmail: ""
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!RequestResetPasswordPage.cssText) {
                const request = await fetch('components/RequestResetPasswordPage.css');
                RequestResetPasswordPage.cssText = await request.text();

            }
            styles.textContent = RequestResetPasswordPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('request-reset-password-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);

        this.setFormBindings(this.root.querySelector("form"));
    }

    setFormBindings(form) {
        console.log(form)
        if (form) {
            form.addEventListener("submit", event => {
                event.preventDefault();

                this.#dataForm.usernameOrEmail = "";
                this.#dataForm.password = "";
                // TODO Send the data to the server
            })

            this.#dataForm = new Proxy(this.#dataForm, {
                set(target, property, value) {
                    target[property] = value;
                    form.elements[property].value = value;
                    return true;
                }
            });

            Array.from(form.elements).forEach(element => {
                element.addEventListener("change", event => {
                    this.#dataForm[element.name] = element.value;
                })
            })
        }
    }
}

customElements.define('request-reset-password-page', RequestResetPasswordPage);