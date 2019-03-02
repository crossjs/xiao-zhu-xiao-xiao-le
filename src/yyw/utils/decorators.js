var yyw;
(function (yyw) {
    function debounce(timeout) {
        if (timeout === void 0) { timeout = 100; }
        return function (target, key, descriptor) {
            if (descriptor === undefined) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            var originalMethod = descriptor.value;
            var handle;
            descriptor.value = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (handle) {
                    egret.clearTimeout(handle);
                }
                handle = egret.setTimeout(function () {
                    originalMethod.apply(_this, args);
                }, this, timeout * yyw.CONFIG.speedRatio);
            };
            return descriptor;
        };
    }
    yyw.debounce = debounce;
})(yyw || (yyw = {}));
