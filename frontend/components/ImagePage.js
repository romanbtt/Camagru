export class ImagePage extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: "open" });

        const template = document.getElementById("image-page-template");
        const content = template.content.cloneNode(true);
        const styles = document.createElement("style");
        this.root.appendChild(content);
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!ImagePage.cssText) {
                const request = await fetch('components/ImagePage.css');
                ImagePage.cssText = await request.text();

            }
            styles.textContent = ImagePage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async fetchImage(id) {
        const response = await fetch(`http://localhost:3000/pictures/one/${id}`);
        const data = await response.json();

        this.imageDiv.innerHTML = "";

        return data;
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        this.imageDiv = this.root.querySelector('#image');
        this.likesDiv = this.root.querySelector('#likes');
        this.ownerDiv = this.root.querySelector('#owner');
        this.comments = this.root.querySelector('#comments');
        this.commentInput = this.root.querySelector('#comment-input');
        this.commentButton = this.root.querySelector('#comment-button');
        this.heart = this.root.querySelector('#heart');
        let data;

        if (this.dataset.imageId) {
            data = await this.fetchImage(this.dataset.imageId);
        } else {
            alert("Invalid Product ID");
            return;
        }

        const image = document.createElement('img');
        image.src = "http://localhost:3000/" + data.path;
        this.imageDiv.appendChild(image);
        let likesCount = data.likes.length;

        if (!app.store.isSignedIn) {
            this.commentInput.disabled = true;
            this.commentButton.disabled = true;
            this.heart.classList.remove("can-toggle");
            this.comments.innerHTML = "Please sign in to comment or like this image";
        } else {
            this.heart.classList.add("can-toggle");
            //const isLiked = data.likes.includes(app.store.myUser._id);
            //isLiked ? this.heart.classList.add("liked") : this.heart.classList.remove("liked");
        }


        this.likesDiv.textContent = likesCount === 1 ? `${likesCount} like` : `${likesCount} likes`;
        this.ownerDiv.textContent = `See all ${data.user.username}'s Camagrus`

        this.ownerDiv.addEventListener("click", () => {
            app.store.otherUser = data.user.username;
            app.router.go('/user-' + data.user._id, true);
        });

        this.heart.addEventListener("click", async (event) => {
            if (app.store.isSignedIn) {
                // provisoire

                if (this.heart.classList.contains("liked")) {
                    this.heart.classList.remove("liked");
                    this.heart.classList.add("unliked");
                    likesCount -= 1;
                    this.likesDiv.textContent = likesCount === 1 ? `${likesCount} like` : `${likesCount} likes`;
                } else {
                    this.heart.classList.add("liked");
                    this.heart.classList.remove("unliked");
                    likesCount += 1;
                    this.likesDiv.textContent = likesCount === 1 ? `${likesCount} like` : `${likesCount} likes`;
                }
            }
        });
    }
}

customElements.define("image-page", ImagePage);