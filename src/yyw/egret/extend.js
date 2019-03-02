Object.defineProperty(egret.DisplayObject.prototype, "scale", {
    get() {
        return this.scaleX;
    },
    set(value) {
        this.scaleX = this.scaleY = value;
    },
});
