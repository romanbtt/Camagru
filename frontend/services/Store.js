const Store = {
    stickers: null,
    selectedMenu: null,
    isSignedIn: false,
    myUser: null,
    otherUser: null,
}

const proxiedStore = new Proxy(Store, {
    set(target, property, value) {
        target[property] = value;
        if (property === "selectedMenu") {
            window.dispatchEvent(new CustomEvent("appmenuchange"));
        }
        if (property === "isSignedIn") {
            window.dispatchEvent(new CustomEvent("appsigninchange"));
        }
        return true;
    }

});

export default proxiedStore;