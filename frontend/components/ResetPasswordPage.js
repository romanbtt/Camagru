import API from "../services/API.js";

export class ResetPasswordPage extends HTMLElement {

    #dataForm = {
        password: "",
        confirmPassword: ""
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!ResetPasswordPage.cssText) {
                const request = await fetch('components/ResetPasswordPage.css');
                ResetPasswordPage.cssText = await request.text();

            }
            styles.textContent = ResetPasswordPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('reset-password-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);
        const token = this.dataset.token;

        this.setFormBindings(this.root.querySelector("form"));
    }

    setFormBindings(form) {
        console.log(form)
        if (form) {
            form.addEventListener("submit", async event => {
                event.preventDefault();

                const { ok, data } = await API.resetPassword(this.dataset.token, this.#dataForm.password);
                const info = this.root.getElementById('info-form');

                if (ok) {
                    info.style.color = 'green';
                    info.textContent = data.message;

                    setTimeout(() => {
                        app.router.go("/signin", true);
                    }, 5000);

                } else {
                    info.style.color = 'red';
                    info.textContent = data.message;
                }

                this.#dataForm.password = "";
                this.#dataForm.confirmPassword = "";

                setTimeout(() => {
                    info.textContent = "‎";
                }, 5000);
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

                    if (element.name === 'password' || element.name === 'confirmPassword') {
                        const password = form.elements['password'].value;
                        const confirmPassword = form.elements['confirmPassword'].value;

                        if (password !== confirmPassword) {
                            form.elements['confirmPassword'].setCustomValidity('Passwords do not match.');
                        } else {
                            form.elements['confirmPassword'].setCustomValidity('');
                        }
                    }
                })
            })
        }
    }
}

customElements.define('reset-password-page', ResetPasswordPage);