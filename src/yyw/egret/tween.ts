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
      target.x = Math.pow(1 - factor, 2) * p0.x
        + 2 * factor * (1 - factor) * p1.x
        + Math.pow(factor, 2) * p2.x;
      target.y = Math.pow(1 - factor, 2) * p0.y
        + 2 * factor * (1 - factor) * p1.y
        + Math.pow(factor, 2) * p2.y;
    });

    const p0 = new egret.Point(target.x, target.y);
    const p2: egret.Point = new egret.Point(props.x, props.y);
    const p1 = egret.Point.interpolate(p0, p2, (yyw.random(4) + 3) / 10);
    const p20 = p2.subtract(p0);
    const radians = Math.atan2(p20.y, p20.x);
    const distance = yyw.random(p20.length);
    p1.offset(distance * Math.sin(radians), distance * Math.cos(radians));

    return tween.to({
      factor: 1,
    }, duration, ease);
  }
}
