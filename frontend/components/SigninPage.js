import API from "../services/API.js";

export class SigninPage extends HTMLElement {

    #dataForm = {
        usernameOrEmail: "",
        password: ""
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!SigninPage.cssText) {
                const request = await fetch('components/SigninPage.css');
                SigninPage.cssText = await request.text();

            }
            styles.textContent = SigninPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('signin-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);

        const resetPassword = this.root.getElementById('reset-password');

        resetPassword.addEventListener('click', () => {
            app.router.go('/request-reset-password', true);
        });

        this.setFormBindings(this.root.querySelector("form"));
    }

    setFormBindings(form) {
        if (form) {
            form.addEventListener("submit", async event => {
                event.preventDefault();

                const { ok, data } = await API.signin(this.#dataForm);

                if (ok) {
                    app.store.myUser = data.user;
                    app.store.isSignedIn = true;
                    app.router.go("/", true);
                } else {
                    const error = this.root.getElementById('error-form');
                    error.textContent = data.message;

                    setTimeout(() => {
                        error.textContent = "";
                    }, 5000);
                }

                this.#dataForm.usernameOrEmail = "";
                this.#dataForm.password = "";
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

customElements.define('signin-page', SigninPage);