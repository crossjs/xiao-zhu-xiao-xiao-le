namespace yyw {
  class PromisedTween {
    private tween: egret.Tween;

    constructor(target: egret.DisplayObject, loop: boolean = false, onChange?: any) {
      this.tween = egret.Tween.get(target, {
        loop,
        onChange,
        onChangeObj: this,
      });
    }

    public to(
      props: any,
      duration: number = 100,
      ease: any = egret.Ease.quadOut,
    ): Promise<any> {
      // @todo 使用计算
      // Object.entries(props).forEach(([key, value]) => {
      //   if (typeof value === "string" && /^[+-]/.test(value)) {
      //   }
      // });
      return new Promise((resolve) => {
        this.tween.setPaused(false).to(props, duration * CONFIG.speedRatio, ease).call(resolve);
      });
    }
  }

  export function removeAllTweens() {
    egret.Tween.removeAllTweens();
  }

  export function pauseTweens(target: egret.DisplayObject) {
    egret.Tween.pauseTweens(target);
  }

  export function resumeTweens(target: egret.DisplayObject) {
    egret.Tween.resumeTweens(target);
  }

  export function removeTweens(target: egret.DisplayObject): void {
    egret.Tween.removeTweens(target);
  }

  export function getTween(target: egret.DisplayObject, loop: boolean = false, onChange?: any): PromisedTween {
    return new PromisedTween(target, loop, onChange);
  }

  export async function fadeIn(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    target.alpha = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
    }, duration, ease);
  }

  export async function fadeOut(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
    }, duration, ease);
    target.visible = false;
    target.alpha = 1;
  }

  export async function zoomIn(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    target.alpha = 0;
    target.scale = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
      scale: 1,
    }, duration, ease);
  }

  export async function zoomOut(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
      scale: 0,
    }, duration, ease);
    target.visible = false;
    target.alpha = 1;
    target.scale = 1;
  }

  export async function twirlIn(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    target.alpha = 0;
    target.scale = 0;
    target.rotation = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
      scale: 1,
      rotation: 1080,
    }, duration, ease);
  }

  export async function twirlOut(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
      scale: 0,
      rotation: -1080,
    }, duration, ease);
    target.visible = false;
    target.alpha = 1;
    target.scale = 1;
    target.rotation = 0;
  }

  export async function tweenTo(
    target: egret.DisplayObject,
    props: any,
    duration?: number,
    ease?: any,
  ): Promise<any> {
    return new PromisedTween(target).to(props, duration, ease);
  }

  export async function bezierTo(
    target: egret.DisplayObject,
    props: any,
    duration?: number,
    ease?: any,
  ): Promise<any> {
    const tween = new PromisedTween(target, false, () => {
      const { factor } = target;
      target.x = Math.pow(1 - factor, 3) * pointFrom.x
        + 3 * factor * Math.pow(1 - factor, 2) * pointControl1.x
        + 3 * Math.pow(factor, 2) * (1 - factor) * pointControl2.x
        + Math.pow(factor, 3) * pointTo.x;
      target.y = Math.pow(1 - factor, 3) * pointFrom.y
        + 3 * factor * Math.pow(1 - factor, 2) * pointControl1.y
        + 3 * Math.pow(factor, 2) * (1 - factor) * pointControl2.y
        + Math.pow(factor, 3) * pointTo.y;
    });

    // 起点
    const pointFrom = new egret.Point(target.x, target.y);
    // 终点
    const pointTo: egret.Point = new egret.Point(props.x, props.y);
    const dirX: number = pointTo.x - pointFrom.x ? 1 : -1;
    const dirY: number = pointTo.y - pointFrom.y ? 1 : -1;
    // 控制点，取中间
    const pointControl1 = egret.Point.interpolate(pointFrom, pointTo, 0.75);
    const pointControl2 = egret.Point.interpolate(pointFrom, pointTo, 0.25);
    const pointAngle = pointTo.subtract(pointFrom);
    const radius = Math.atan2(pointAngle.y, pointAngle.x);
    // 起点到终点的距离内，取 1/4 长度
    const offsetLength = pointAngle.length / 4;
    const offsetX = offsetLength * Math.sin(radius);
    const offsetY = offsetLength * Math.cos(radius);
    pointControl1.offset(dirX * offsetX, -dirY * offsetY);
    pointControl2.offset(dirX * offsetX, -dirY * offsetY);

    // const p0 = drawPoint(pointFrom, 0xff0000);
    // const p1 = drawPoint(pointControl1, 0xffff00);
    // const p2 = drawPoint(pointControl2, 0x00ffff);
    // const p3 = drawPoint(pointTo, 0x00ff00);

    // target.stage.addChild(p0);
    // target.stage.addChild(p1);
    // target.stage.addChild(p2);
    // target.stage.addChild(p3);

    target.factor = 0;
    return tween.to({
      factor: 1,
    }, duration, ease);
  }

  // function drawPoint(point: egret.Point, color = 0xff0000) {
  //   const pf = new egret.Shape();
  //   pf.graphics.beginFill(color);
  //   pf.graphics.drawCircle(point.x, point.y, 30);
  //   pf.graphics.endFill();
  //   return pf;
  // }
}
