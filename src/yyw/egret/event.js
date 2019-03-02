var yyw;
(function (yyw) {
    var dispatcher = new egret.EventDispatcher();
    function on(type, listener, thisObj) {
        if (thisObj === void 0) { thisObj = null; }
        dispatcher.addEventListener(type, listener, thisObj);
    }
    yyw.on = on;
    function once(type, listener, thisObj) {
        if (thisObj === void 0) { thisObj = null; }
        dispatcher.once(type, listener, thisObj);
    }
    yyw.once = once;
    function off(type, listener, thisObj) {
        if (thisObj === void 0) { thisObj = null; }
        dispatcher.removeEventListener(type, listener, thisObj);
    }
    yyw.off = off;
    function emit(type, data) {
        if (data === void 0) { data = {}; }
        dispatcher.dispatchEventWith(type, false, data);
    }
    yyw.emit = emit;
})(yyw || (yyw = {}));
