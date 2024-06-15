const ZOOM_STEP = 0.1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

export class CamacraftPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        this.canOverlay = false;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoomLevel = 1;

        const styles = document.createElement('style');
        this.root.appendChild(styles);

        async function loadCSS() {
            if (!CamacraftPage.cssText) {
                const request = await fetch('components/CamacraftPage.css');
                CamacraftPage.cssText = await request.text();

            }
            styles.textContent = CamacraftPage.cssText;
        }
        this.loadCSSPromise = loadCSS();
    }

    async startWebcam() {
        const videoElement = this.root.getElementById('webcam');
        const overlayElement = this.root.getElementById('overlay');

        const handleDoubleClick = () => {
            overlayElement.style.display = 'none';
            overlayElement.src = '';
        }

        const handleMouseDown = (event) => {
            this.dragging = true;
            this.offsetX = event.clientX - overlayElement.offsetLeft;
            this.offsetY = event.clientY - overlayElement.offsetTop;
        }

        const handleMouseMove = (event) => {
            if (this.dragging) {
                overlayElement.style.left = event.clientX - this.offsetX + 'px';
                overlayElement.style.top = event.clientY - this.offsetY + 'px';
            }
        }

        const handleMouseUp = () => {
            this.dragging = false;
        }

        const handleWheel = (event) => {
            event.preventDefault();
            if (event.deltaY < 0) {
                this.zoomLevel = Math.min(MAX_ZOOM, this.zoomLevel + ZOOM_STEP);
            } else {
                this.zoomLevel = Math.max(MIN_ZOOM, this.zoomLevel - ZOOM_STEP);
            }
            overlayElement.style.transform = 'scale(' + this.zoomLevel + ')';
        }

        const handleDragStart = (event) => {
            event.preventDefault();
        }

        overlayElement.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        overlayElement.addEventListener('mouseup', handleMouseUp);
        overlayElement.addEventListener('wheel', handleWheel);
        overlayElement.addEventListener('dragstart', handleDragStart);
        overlayElement.addEventListener('dblclick', handleDoubleClick);

        let loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Loading...';
        loadingMessage.className = 'loading-message';
        videoElement.parentNode.insertBefore(loadingMessage, videoElement);

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 500 },
                    height: { ideal: 500 }
                }
            });
            videoElement.srcObject = this.stream;
            videoElement.play();
            this.canOverlay = true;

            videoElement.onplaying = () => {
                loadingMessage.style.display = 'none';
            };
        } catch (error) {
            console.error('Error starting webcam:', error);
        }
    }

    stopWebcam() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }

    async connectedCallback() {
        await this.loadCSSPromise;

        const template = document.getElementById('camacraft-page-template');
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);


        const categoriesDropdown = this.root.getElementById('category-select');
        const stickersContainer = this.root.getElementById('stickers');
        const categoryTitle = this.root.getElementById('category-title');
        const overlayElement = this.root.getElementById('overlay');

        this.startWebcam();


        console.log(app.store.stickers)
        app.store.stickers.forEach(category => {
            var option = document.createElement('option');
            option.value = category.category;
            option.textContent = category.category;
            categoriesDropdown.appendChild(option);
        });

        const updateStickers = () => {
            let selectedCategory = categoriesDropdown.value;
            let category = app.store.stickers.find(item => item.category === selectedCategory);
            console.log(category);
            stickersContainer.innerHTML = '';
            categoryTitle.textContent = categoriesDropdown.value;

            if (category) {
                category.paths.forEach(path => {
                    var img = document.createElement('img');
                    img.src = "http://localhost:3000/" + path;
                    img.addEventListener('click', () => {
                        if (this.canOverlay) {
                            overlayElement.src = "http://localhost:3000/" + path;
                            overlayElement.style.display = 'block';
                            overlayElement.style.left = '150px';
                            overlayElement.style.top = '150px';
                            overlayElement.style.transform = 'scale(1)';
                        }
                    });
                    stickersContainer.appendChild(img);
                });
            }
        }

        updateStickers();

        categoriesDropdown.addEventListener('change', updateStickers);

        let videoElement = this.root.getElementById('webcam');
        const uploadButton = this.root.getElementById('upload-file');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const supportedFormats = ['apng', 'avif', 'gif', 'jpeg', 'png', 'webp'];
                const format = file.type.split('/')[1];

                if (file.type.indexOf('image/') !== 0 || !supportedFormats.includes(format)) {
                    const videoElement = this.root.getElementById('webcam');
                    const imageElement = this.root.getElementById('picture');
                    let errorMessage = document.createElement('div');
                    if (imageElement) {
                        imageElement.parentNode.replaceChild(errorMessage, imageElement);
                    } else if (videoElement) {
                        videoElement.parentNode.replaceChild(errorMessage, videoElement);
                    }
                    errorMessage.textContent = 'Invalid file format';
                    errorMessage.className = 'error-message';
                    errorMessage.id = 'error-message';

                    this.canOverlay = false;

                    const overlayElement = this.root.getElementById('overlay');
                    overlayElement.style.display = 'none';
                    overlayElement.src = '';

                    setTimeout(() => {
                        this.stopWebcam();
                    }, 3000);
                    return;
                }


                const url = URL.createObjectURL(file);
                const videoElement = this.root.getElementById('webcam');
                const imageElement = this.root.getElementById('picture');
                const errorMessage = this.root.getElementById('error-message');

                const newImageElement = document.createElement('img');
                newImageElement.src = url;
                newImageElement.id = 'picture';

                if (videoElement) {
                    videoElement.parentNode.replaceChild(newImageElement, videoElement);
                } else if (imageElement) {
                    imageElement.parentNode.replaceChild(newImageElement, imageElement);
                } else if (errorMessage) {
                    errorMessage.parentNode.replaceChild(newImageElement, errorMessage);
                }

                this.canOverlay = true;
                const loadingMessage = this.root.querySelector('.loading-message');
                loadingMessage.style.display = 'none';
                setTimeout(() => {
                    this.stopWebcam();
                }, 3000);
            }
        });

        const captureButton = this.root.getElementById('capture-button');

        captureButton.addEventListener('click', () => {
            const videoElement = this.root.getElementById('webcam');
            const imageElement = this.root.getElementById('picture');
            const overlayElement = this.root.getElementById('overlay');

            let sourceElement = videoElement || imageElement;

            const overlayRect = overlayElement.getBoundingClientRect();
            const videoRect = sourceElement.getBoundingClientRect();

            const relativePosX = overlayRect.left - videoRect.left;
            const relativePosY = overlayRect.top - videoRect.top;

            console.log(relativePosX, relativePosY, this.zoomLevel);


        });

        if (!app.store.isSignedIn) {
            captureButton.disabled = true;
        }
    }
}

customElements.define('camacraft-page', CamacraftPage);
