window.offsetsReady = new Promise(function (res, rej) {
    var s = document.querySelector('script[src^="../offsets/"]');
    if (!s) return rej(new Error("offsets script was never injected by main.js"));
    if (typeof OFFSET_wk_vtable_first_element !== "undefined") return res(s.src);
    s.addEventListener("load", function () { res(s.src); });
    s.addEventListener("error", function () {
        rej(new Error("offsets 404: " + s.src));
    });
});
