(function () {
    var pending = [];
    window.__jbEarly = pending;
    function raw(tag, text) {
        var line = "a0-rboot-s" + (pending.length + 1) + "-note-" + tag
            + "-" + String(text).replace(/[^A-Za-z0-9_.:=,+-]/g, "_").slice(0, 160);
        pending.push(line);
        try {
            var d = document.getElementById("early");
            if (d) d.textContent += line + "\n";
        } catch (e) { }
    }
    window.__jbRaw = raw;
    window.alert = function (m) { raw("ALERT-INTERCEPTED", m); };
    window.confirm = function (m) { raw("CONFIRM-INTERCEPTED", m); return false; };
    window.addEventListener("error", function (e) {
        raw("WINDOW-ERROR", (e && e.message) + "@" + (e && e.filename)
            + ":" + (e && e.lineno));
    });
    window.addEventListener("unhandledrejection", function (e) {
        raw("UNHANDLED-REJECTION",
            e && e.reason && (e.reason.message || e.reason));
    });
})();
