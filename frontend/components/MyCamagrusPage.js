export class MyCamagrusPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!MyCamagrusPage.cssText) {
                const request = await fetch('components/MyCamagrusPage.css');
                MyCamagrusPage.cssText = await request.text();

            }
            styles.textContent = MyCamagrusPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async fetchImages(page, user) {
        const response = await fetch(`http://localhost:3000/pictures/page/${page}/${user}`);
        const data = await response.json();

        this.imagesDiv.innerHTML = "";

        data.pictures.map(element => {
            const image = document.createElement('image-item');
            image.dataset.item = JSON.stringify(element);
            image.dataset.from = 'mycamagrus';
            this.imagesDiv.appendChild(image);

            image.addEventListener("click", () => {
                app.router.go('/image-' + element._id, true);
            });
        });

        this.nextButton.disabled = !data.hasNextPage;
        this.prevButton.disabled = !data.hasPrevPage;
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('user-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);

        this.owner = this.root.querySelector('#owner');
        this.imagesDiv = this.root.querySelector('#images');
        this.nextButton = this.root.querySelector('#nextButton');
        this.prevButton = this.root.querySelector('#prevButton');

        if (this.dataset.myUser) {

            this.nextButton.addEventListener('click', () => {
                this.currentPage++;
                this.fetchImages(this.currentPage, this.dataset.myUser);
            });

            this.prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.fetchImages(this.currentPage, this.dataset.myUser);
                }
            });
            this.owner.innerText = `My camagrus`;
            this.currentPage = 1;
            this.fetchImages(this.currentPage, this.dataset.myUser);
        } else {
            alert("Invalid User ID");
            return;
        }
    }
}

customElements.define('my-camagrus-page', MyCamagrusPage);
