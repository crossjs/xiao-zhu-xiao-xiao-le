// 使显示对象有 scale 属性
Object.defineProperty(egret.DisplayObject.prototype, "scale", {
  get(): number {
    return this.scaleX;
  },
  set(value: number) {
    this.scaleX = this.scaleY = value;
  },
});
