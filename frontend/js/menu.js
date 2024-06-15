import { isAccessTokenValid, isRefreshTokenValid, isSignedIn, signOut } from "./utils/tokenUtility.js";

var loadedScripts = {};
let indexTitle = 0;
const camagrus = ["Camagru", "Amagruc", "Magruca", "Agrucam", "Grucama", "Rucamag", "Ucamagr"];

export function initializeMenu() {
    loadMenu();
    handleResize();
    handleClick();
    handleEasterEgg();
}

function loadMenu() {
    if (isSignedIn()) {
        fetch('./menu-signed-in.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('menu').innerHTML = data;
                document.querySelector('.hamburger').addEventListener('click', toggleMenu);
            });
    } else {
        fetch('./menu-signed-out.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('menu').innerHTML = data;
                document.querySelector('.hamburger').addEventListener('click', toggleMenu);
            });
    }
}

export function updateMenu(isSignedIn) {
    var menuHref = isSignedIn ? './menu-signed-in.html' : './menu-signed-out.html';

    fetch(menuHref)
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu').innerHTML = data;
            document.querySelector('.hamburger').addEventListener('click', toggleMenu);
        });
}

function handleEasterEgg() {
    let index = 42;
    let easterEgg = document.getElementById('easter-egg');
    easterEgg.textContent = index;

    easterEgg.addEventListener('click', function () {
        index--;
        easterEgg.textContent = index;
        if (index === 0) {
            var img = document.createElement('img');
            img.src = 'https://i.giphy.com/l0HlxaubxvuvNH0FW.webp';
            img.style.position = 'fixed';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '94%';
            img.style.zIndex = '1000';
            img.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'center';
            img.style.cursor = 'pointer';
            img.addEventListener('click', function () {
                img.remove();
                index = 42;
                easterEgg.textContent = index;
            });
            index = 42;
            easterEgg.textContent = index;
            document.body.appendChild(img);
        }
    });

}

function toggleMenu() {
    var menu = document.querySelector('.layout-menu-links');
    menu.classList.toggle('open');
}

function handleResize() {
    window.addEventListener('resize', function () {
        var menu = document.querySelector('.layout-menu-links');
        if (window.innerWidth > 768) {
            menu.classList.remove('open');
        }
    });
}

var currentPage = null;

export function loadPage(href) {
    var scriptMap = {
        '/html/feed.html': '../js/feed.js',
        '/html/camacraft.html': '../js/camacraft.js',
        '/html/signup.html': '../js/signup.js',
        '/html/signin.html': '../js/signin.js',
        '/html/reset-password.html': '../js/reset-password.js'
    };

    fetch("/frontend" + href)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;

            var scriptSrc = scriptMap[href];
            if (!loadedScripts[scriptSrc]) {
                var script = document.createElement('script');
                script.type = 'module';
                script.src = scriptSrc;
                document.body.appendChild(script);
                loadedScripts[scriptSrc] = true;
            } else {
                switch (href) {
                    case '/html/camacraft.html':
                        window.initCamacraft();
                        break;
                }
            }
        });
}

function handleClick() {
    document.addEventListener('click', function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === 'a') {
            event.preventDefault();

            var href = target.getAttribute('href');

            if (href === currentPage) {
                return;
            }
            currentPage = href;

            if (href !== '/html/camacraft.html' && window.stopWebcam) {
                window.stopWebcam();
            }

            if (href === '/html/signout.html') {
                signout();
                return;
            }

            var menu = document.querySelector('.layout-menu-links');
            menu.classList.remove('open');

            loadPage(href);
        }
    });
}

function signout() {
    signOut();
    updateMenu(false);
    loadPage('/html/feed.html');
}

function easterEgg() {
    let easterEggTitle = document.getElementById('easter-egg-title');

    indexTitle++;
    easterEggTitle.textContent = camagrus[indexTitle % camagrus.length];
}
