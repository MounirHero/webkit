
// bridge.js - Log bridge from poops/p2jb iframe to parent window
(function(){
    "use strict";

    // Map exploit stages to progress percentage
    var PROGRESS_MAP = {
        "checking": 5,
        "latch": 5,
        "preflight": 10,
        "ps0": 10,
        "groom": 25,
        "ps1": 25,
        "trigger": 40,
        "ps2": 40,
        "primitive": 55,
        "ps3": 55,
        "kernel": 70,
        "ps4": 70,
        "kexp": 75,
        "payload": 85,
        "ps5": 85,
        "elfldr": 90,
        "win": 100,
        "success": 100,
        "done": 100,
        "completed": 100,
        "fail": -1,
        "error": -1,
        "reboot": -1,
        "panic": -1
    };

    function sendToParent(type, data){
        try {
            if(window.parent && window.parent !== window){
                window.parent.postMessage(Object.assign({bridgeType: type, chain: window.__BRAND || "unknown"}, data || {}), "*");
            }
        }catch(e){}
    }

    function detectProgress(msg){
        if(!msg) return 0;
        var lower = msg.toLowerCase();
        for(var key in PROGRESS_MAP){
            if(lower.indexOf(key) >= 0) return PROGRESS_MAP[key];
        }
        return 0;
    }

    // Intercept __jbRaw
    var _realJbRaw = null;
    Object.defineProperty(window, "__jbRaw", {
        set: function(fn){
            _realJbRaw = fn;
        },
        get: function(){
            return function(tag, text){
                var prog = detectProgress(text);
                sendToParent("log", {tag: tag, text: text, progress: prog});
                if(_realJbRaw) _realJbRaw(tag, text);
            };
        }
    });

    // Intercept __jbEarly pushes
    var _origPush = null;
    Object.defineProperty(window, "__jbEarly", {
        set: function(arr){
            if(arr && arr.push){
                _origPush = arr.push.bind(arr);
                arr.push = function(item){
                    var result = _origPush(item);
                    sendToParent("early", {item: item});
                    return result;
                };
            }
        },
        get: function(){ return window._jbEarlyArr || []; }
    });

    // Intercept stage() if it becomes global
    var _origStage = null;
    Object.defineProperty(window, "stage", {
        set: function(fn){ _origStage = fn; },
        get: function(){
            return function(msg, cls){
                var prog = detectProgress(msg);
                sendToParent("stage", {msg: msg, cls: cls, progress: prog});
                if(_origStage) _origStage(msg, cls);
            };
        }
    });

    // Intercept window.alert and confirm
    var origAlert = window.alert;
    window.alert = function(msg){
        sendToParent("alert", {msg: msg});
        if(origAlert) origAlert(msg);
    };
    var origConfirm = window.confirm;
    window.confirm = function(msg){
        sendToParent("confirm", {msg: msg});
        if(origConfirm) return origConfirm(msg);
        return false;
    };

    // Intercept error handlers
    window.addEventListener("error", function(e){
        sendToParent("error", {msg: e.message, file: e.filename, line: e.lineno});
    });
    window.addEventListener("unhandledrejection", function(e){
        sendToParent("rejection", {msg: e.reason && (e.reason.message || e.reason)});
    });

    // Notify parent that bridge is ready
    sendToParent("ready", {});
})();
