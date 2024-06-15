export class ImageItem extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        this.root.appendChild(styles);
        this.loadCSSPromise = loadCSS();

        async function loadCSS() {
            if (!ImageItem.cssText) {
                const request = await fetch('components/ImageItem.css');
                ImageItem.cssText = await request.text();

            }
            styles.textContent = ImageItem.cssText;
        }
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const item = JSON.parse(this.dataset.item);

        const template = document.getElementById("image-item-template");
        const content = template.content.cloneNode(true);

        this.root.appendChild(content);

        this.image = this.root.querySelector("#image");
        this.count = this.root.querySelector("#count");
        this.imageContainer = this.root.querySelector("#image-container");
        this.likes = this.root.querySelector("#likes");
        this.heart = this.root.querySelector("#heart");

        this.image.src = "http://localhost:3000/" + item.path;
        this.count.innerHTML = item.likes.length;

        if (!app.store.isSignedIn) {
            this.heart.classList.remove("can-toggle");
            this.count.classList.remove("can-toggle");
        } else {
            this.heart.classList.add("can-toggle");
            this.count.classList.add("can-toggle");
            //const isLiked = data.likes.includes(app.store.myUser._id);
            //isLiked ? this.heart.classList.add("liked") : this.heart.classList.remove("liked");
        }

        if (this.dataset.from === "mycamagrus") {
            const deleteButton = document.createElement("img");
            deleteButton.src = "./assets/delete.svg";
            deleteButton.classList.add("can-delete");
            deleteButton.id = "delete";
            this.imageContainer.appendChild(deleteButton);
        }

        this.likes.addEventListener("click", async (event) => {
            event.stopPropagation();
            if (app.store.isSignedIn) {
                // provisoire

                if (this.heart.classList.contains("liked")) {
                    this.heart.classList.remove("liked");
                    this.count.classList.remove("liked");
                    this.heart.classList.add("unliked");
                    this.count.classList.add("unliked");
                    this.count.innerHTML = parseInt(this.count.innerHTML) - 1;
                } else {
                    this.heart.classList.add("liked");
                    this.count.classList.add("liked");
                    this.heart.classList.remove("unliked");
                    this.count.classList.remove("unliked");
                    this.count.innerHTML = parseInt(this.count.innerHTML) + 1;
                }
            }
        });
    }
}

customElements.define("image-item", ImageItem);