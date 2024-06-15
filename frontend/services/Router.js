
const linkClickListener = (event) => {
    event.preventDefault();
    console.log(Router.currentRoute)
    if (Router.currentRoute === "/camacraft") {
        const camacraftPage = document.querySelector("camacraft-page");
        camacraftPage.stopWebcam();
    }
    const route = event.target.getAttribute("href");
    if (route !== Router.currentRoute) {
        Router.go(route);
    }
};

const popstateListener = (event) => {
    console.log("popstateListener");
    Router.go(event.state.route, false);
};

const addEventListenersToMenu = () => {
    document.querySelectorAll("a.navlink").forEach((link) => {
        link.addEventListener("click", linkClickListener);
    });

    // if (Router.currentRoute === "/signin") {
    //     if (Router.lastRoute !== "/signup") {
    //         Router.go(Router.lastRoute || "/", true);
    //     } else {
    //         Router.go("/", true);
    //     }
    // } else if (Router.currentRoute === "/signout") {
    //     Router.go("/", true);
    // }
};

const Router = {
    init: () => {
        addEventListenersToMenu();

        window.addEventListener("popstate", popstateListener);
        window.addEventListener("appsigninchange", addEventListenersToMenu);

        Router.go(location.pathname);
    },
    go: (route, addToHistory = true) => {
        if (addToHistory) {
            const isQueryString = route === "/reset-password.html" || route === "/verify-email.html";
            history.pushState({ route }, "", route + (isQueryString ? window.location.search : ""));
        }

        Router.lastRoute = Router.currentRoute;
        Router.currentRoute = route;

        let pageElement = null;

        console.log("route", route)

        switch (route) {
            case "/":
                pageElement = document.createElement("feed-page");
                app.store.selectedMenu = "feed";
                break;
            case "/camacraft":
                pageElement = document.createElement("camacraft-page");
                app.store.selectedMenu = "camacraft";
                break;
            case "/mycamagrus":
                pageElement = document.createElement("my-camagrus-page");
                app.store.selectedMenu = "mycamagrus";
                pageElement.dataset.myUser = app.store.myUser._id;
                break;
            case "/profile":
                pageElement = document.createElement("profile-page");
                app.store.selectedMenu = "profile";
                break;
            case "/signup":
                pageElement = document.createElement("signup-page");
                app.store.selectedMenu = "signup";
                break;
            case "/signin":
                pageElement = document.createElement("signin-page");
                app.store.selectedMenu = "signin";
                break;
            case "/request-reset-password":
                pageElement = document.createElement("request-reset-password-page");
                app.store.selectedMenu = "none";
                break;
            case "/signout":
                pageElement = document.createElement("signout-page");
                app.store.selectedMenu = "none";
                break;
            case "/reset-password.html":
                pageElement = document.createElement("reset-password-page");
                app.store.selectedMenu = "none";
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                pageElement.dataset.token = urlParams.get("token");
                break;
            case "/verify-email.html":
                console.log("verify-email.html")
                pageElement = document.createElement("verify-email-page");
                app.store.selectedMenu = "none";
                const verifyEmailQueryString = window.location.search;
                const verifyEmailUrlParams = new URLSearchParams(verifyEmailQueryString);
                pageElement.dataset.token = verifyEmailUrlParams.get("token");
                break;
            default:
                app.store.selectedMenu = "none";
                if (route.startsWith("/image-")) {
                    pageElement = document.createElement("image-page");
                    const paramId = route.substring(route.lastIndexOf("-") + 1);
                    pageElement.dataset.imageId = paramId;
                } else if (route.startsWith("/user-")) {
                    pageElement = document.createElement("user-page");
                    const paramId = route.substring(route.lastIndexOf("-") + 1);
                    pageElement.dataset.userId = paramId;
                    pageElement.dataset.username = app.store.otherUser;
                }
        }

        if (pageElement) {
            document.querySelector("main").innerHTML = "";
            document.querySelector("main").append(pageElement);
            window.scrollTo(0, 0);
        } else {
            document.querySelector("main").innerHTML = "Page not found";
        }

    }
};

export default Router;