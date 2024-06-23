import API from "../services/API.js";

export class FeedPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!FeedPage.cssText) {
                const request = await fetch('components/FeedPage.css');
                FeedPage.cssText = await request.text();

            }
            styles.textContent = FeedPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async fetchImages(page) {
        const { ok, data } = await API.getPicturesByPage(page);

        this.imagesDiv.innerHTML = "";

        data.pictures.map(element => {
            const image = document.createElement('image-item');
            image.dataset.item = JSON.stringify(element);
            image.dataset.from = 'feed';
            this.imagesDiv.appendChild(image);

            image.addEventListener("click", () => {
                app.router.go('/image-' + element.id, true);
            });
        });

        this.nextButton.disabled = !data.hasNextPage;
        this.prevButton.disabled = !data.hasPrevPage;
    }


    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('feed-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);

        this.imagesDiv = this.root.querySelector('#images');
        this.nextButton = this.root.querySelector('#nextButton');
        this.prevButton = this.root.querySelector('#prevButton');

        this.nextButton.addEventListener('click', () => {
            this.currentPage++;
            this.fetchImages(this.currentPage);
        });

        this.prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchImages(this.currentPage);
            }
        });

        this.currentPage = 1;
        this.fetchImages(this.currentPage);
    }
}

customElements.define('feed-page', FeedPage);