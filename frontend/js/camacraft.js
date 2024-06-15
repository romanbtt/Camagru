let dragging = false;
let offsetX, offsetY;

let zoomLevel = 1;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

let stream = null;
let data = null;

function initCamacraft() {
    fetchCategories();
    startWebcam();
}

function fetchCategories() {
    var stickersContainer = document.getElementById('stickers');
    var categoryTitle = document.getElementById('category-title');
    var categoriesDropdown = document.getElementById('category-select');

    fetch('http://localhost:3000/stickers/categories/all')
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            data.forEach(category => {
                var option = document.createElement('option');
                option.value = category.category;
                option.textContent = category.category;
                categoriesDropdown.appendChild(option);
            });

            var event = new Event('change');
            categoriesDropdown.dispatchEvent(event);
        });

    categoriesDropdown.addEventListener('change', function () {
        var selectedCategory = this.value;
        var categoryData = data.find(category => category.category === selectedCategory);
        stickersContainer.innerHTML = '';
        categoryTitle.textContent = this.value;

        categoryData.paths.forEach(path => {
            var img = document.createElement('img');
            img.src = "http://localhost:3000/" + path;
            img.addEventListener('click', function () {
                overlay.src = "http://localhost:3000/" + path;
                overlay.style.display = 'block';
                overlay.style.left = '100px';
                overlay.style.top = '100px';
            });
            stickersContainer.appendChild(img);
        });
    });
}

function startWebcam() {
    const webcam = document.getElementById('webcam');
    const overlay = document.getElementById('overlay');

    overlay.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mouseup', handleMouseUp);
    overlay.addEventListener('wheel', handleWheel);
    overlay.addEventListener('dragstart', handleDragStart);
    overlay.addEventListener('dblclick', handleDoubleClick);

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((mediaStream) => {
                stream = mediaStream;
                webcam.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });
    } else {
        console.error('getUserMedia not supported in this browser.');
    }
}

function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

function handleDoubleClick() {
    overlay.style.display = 'none';
    overlay.src = '';
}

function handleMouseDown(event) {
    dragging = true;
    offsetX = event.clientX - overlay.offsetLeft;
    offsetY = event.clientY - overlay.offsetTop;
}

function handleMouseMove(event) {
    if (dragging) {
        overlay.style.left = event.clientX - offsetX + 'px';
        overlay.style.top = event.clientY - offsetY + 'px';
    }
}

function handleMouseUp() {
    dragging = false;
}

function handleWheel(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        zoomLevel = Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP);
    } else {
        zoomLevel = Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP);
    }
    overlay.style.transform = 'scale(' + zoomLevel + ')';
}

function handleDragStart(event) {
    event.preventDefault();
}

initCamacraft();

window.initCamacraft = initCamacraft;
window.stopWebcam = stopWebcam;

overlay.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
overlay.addEventListener('mouseup', handleMouseUp);
overlay.addEventListener('wheel', handleWheel);
overlay.addEventListener('dragstart', handleDragStart);