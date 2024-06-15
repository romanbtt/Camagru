import Store from "./services/Store.js";
import API from "./services/API.js";
import { loadStickers } from "./services/Stickers.js";
import Router from "./services/Router.js";

import { FeedPage } from "./components/FeedPage.js";
import { CamacraftPage } from "./components/CamacraftPage.js";
import { MyCamagrusPage } from "./components/MyCamagrusPage.js";
import { ProfilePage } from "./components/ProfilePage.js";
import { SignupPage } from "./components/SignupPage.js";
import { SigninPage } from "./components/SigninPage.js";
import { RequestResetPasswordPage } from "./components/RequestResetPasswordPage.js";
import { ResetPasswordPage } from "./components/ResetPasswordPage.js";
import { SignoutPage } from "./components/SignoutPage.js";
import { VerifyEmailPage } from "./components/VerifyEmailPage.js";

import { UserPage } from "./components/UserPage.js";
import { ImagePage } from "./components/ImagePage.js";
import { ImageItem } from "./components/ImageItem.js";

window.app = {};
app.store = Store;
app.router = Router;

let previousMenuItem = null;

async function checkLoginUser() {
    const { ok, data } = await API.authentificate();

    if (ok) {
        app.store.myUser = data.user;
        app.store.isSignedIn = true;
    }
}

checkLoginUser();

function toggleMenu() {
    var menu = document.querySelector('.layout-menu-links');
    menu.classList.toggle('open');
}

function handleMenu() {
    const menu = document.querySelector(".layout-menu-links");
    if (!app.store.isSignedIn) {
        menu.innerHTML = `
            <a class="navlink" id="feed" href="/">Feed</a>
            <a class="navlink" id="camacraft" href="/camacraft">Camacraft</a>
            <a class="navlink" id="signup" href="/signup">Signup</a>
            <a class="navlink" id="signin" href="/signin">Signin</a>
        `;
    } else {
        menu.innerHTML = `
        <a class="navlink" id="feed" href="/">Feed</a>
        <a class="navlink" id="camacraft" href="/camacraft">Camacraft</a>
        <a class="navlink" id="mycamagrus" href="/mycamagrus">My Camagrus</a>
        <a class="navlink" id="profile" href="/profile">Settings</a>
        <a class="navlink" id="signout" href="/signout">Signout</a>
    `;
    }
}

document.querySelector('.hamburger').addEventListener('click', toggleMenu);

document.addEventListener('click', function (event) {
    if (!event.target.matches('.layout-menu-links') &&
        !event.target.matches('.hamburger') &&
        !event.target.matches('.hamburger-item')) {
        const menu = document.querySelector('.layout-menu-links');
        menu.classList.remove('open');
    }
});

window.addEventListener('resize', function () {
    const menu = document.querySelector('.layout-menu-links');
    if (window.innerWidth > 768) {
        menu.classList.remove('open');
        menu.style.marginTop = "";
        menu.style.height = "";

    }
});

window.addEventListener('scroll', function () {
    if (window.innerWidth <= 768) {
        const menu = document.querySelector('.layout-menu-links');
        const marginTop = Math.max(0, 150 - window.scrollY);
        menu.style.marginTop = marginTop + "px";
        menu.style.height = "calc(100vh - " + marginTop + "px)";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    handleMenu();
    loadStickers();
    app.router.init();
});

window.addEventListener("appmenuchange", event => {
    if (window.innerWidth <= 768) {
        const menu = document.querySelector('.layout-menu-links');
        menu.classList.remove('open');
    }
    if (app.store.selectedMenu === 'none') {
        if (previousMenuItem) {
            previousMenuItem.classList.remove("selected");
        }
        previousMenuItem = null;
    } else {
        const currentMenuItem = document.getElementById(app.store.selectedMenu);

        if (previousMenuItem) {
            previousMenuItem.classList.remove("selected");
        }
        if (currentMenuItem) {
            currentMenuItem.classList.add("selected");
            previousMenuItem = currentMenuItem;
        }

    }
});

window.addEventListener("appsigninchange", event => {
    handleMenu();
});
