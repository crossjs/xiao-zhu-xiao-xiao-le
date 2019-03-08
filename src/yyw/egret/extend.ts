// 使显示对象有 scale 属性
Object.defineProperty(egret.DisplayObject.prototype, "scale", {
  get(): number {
    return this.scaleX;
  },
  set(value: number) {
    this.scaleX = this.scaleY = value;
  },
});

Object.assign(egret.DisplayObject.prototype, {
  $factor: 0,
});

// 使显示对象有 factor 属性
Object.defineProperty(egret.DisplayObject.prototype, "factor", {
  get(): number {
    return this.$factor;
  },
  set(value: number) {
    this.$factor = value;
  },
});
