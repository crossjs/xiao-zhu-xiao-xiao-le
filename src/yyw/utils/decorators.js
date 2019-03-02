var yyw;
(function (yyw) {
    function debounce(timeout = 100) {
        return (target, key, descriptor) => {
            if (descriptor === undefined) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            const originalMethod = descriptor.value;
            let handle;
            descriptor.value = function (...args) {
                if (handle) {
                    egret.clearTimeout(handle);
                }
                handle = egret.setTimeout(() => {
                    originalMethod.apply(this, args);
                }, this, timeout * yyw.CONFIG.speedRatio);
            };
            return descriptor;
        };
    }
    yyw.debounce = debounce;
})(yyw || (yyw = {}));
