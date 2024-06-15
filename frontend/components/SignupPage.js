import API from "../services/API.js";

export class SignupPage extends HTMLElement {

    #dataForm = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!SignupPage.cssText) {
                const request = await fetch('components/SignupPage.css');
                SignupPage.cssText = await request.text();

            }
            styles.textContent = SignupPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('signup-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);

        this.setFormBindings(this.root.querySelector("form"));
    }

    setFormBindings(form) {
        console.log(form)
        if (form) {
            form.addEventListener("submit", async event => {
                event.preventDefault();

                const response = await API.signup(this.#dataForm);
                const data = await response.json();
                const info = this.root.getElementById('info-form');

                if (response.ok) {
                    info.style.color = 'green';
                    info.textContent = data.message;
                } else {
                    info.style.color = 'red';
                    info.textContent = data.message;
                }

                this.#dataForm.username = "";
                this.#dataForm.email = "";
                this.#dataForm.password = "";
                this.#dataForm.confirmPassword = "";
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

customElements.define('signup-page', SignupPage);