var yyw;
(function (yyw) {
    const dispatcher = new egret.EventDispatcher();
    function on(type, listener, thisObj = null) {
        dispatcher.addEventListener(type, listener, thisObj);
    }
    yyw.on = on;
    function once(type, listener, thisObj = null) {
        dispatcher.once(type, listener, thisObj);
    }
    yyw.once = once;
    function off(type, listener, thisObj = null) {
        dispatcher.removeEventListener(type, listener, thisObj);
    }
    yyw.off = off;
    function emit(type, data = {}) {
        dispatcher.dispatchEventWith(type, false, data);
    }
    yyw.emit = emit;
})(yyw || (yyw = {}));
