// 使显示对象有 scale 属性
Object.defineProperty(egret.DisplayObject.prototype, "scale", {
    get: function () {
        return this.scaleX;
    },
    set: function (value) {
        this.scaleX = this.scaleY = value;
    },
});
