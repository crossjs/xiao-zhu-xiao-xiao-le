namespace yyw {
  export class PromisedTween {
    private tween: egret.Tween;

    constructor(target: any) {
      this.tween = egret.Tween.get(target);
    }

    public to(
      props: any,
      duration: number = 100,
      ease: any = egret.Ease.quadOut,
    ): Promise<any> {
      return new Promise((resolve) => {
        this.tween.setPaused(false).to(props, duration * CONFIG.speedRatio, ease).call(resolve);
      });
    }
  }

  export function removeAllTweens() {
    egret.Tween.removeAllTweens();
  }

  export function pauseTweens(target: any) {
    egret.Tween.pauseTweens(target);
  }

  export function resumeTweens(target: any) {
    egret.Tween.resumeTweens(target);
  }

  export function removeTweens(target: egret.DisplayObject): void {
    egret.Tween.removeTweens(target);
  }

  export function getTween(target: egret.DisplayObject): PromisedTween {
    return new PromisedTween(target);
  }

  export async function fadeIn(
    target: egret.DisplayObject,
    duration?: number,
  ): Promise<void> {
    target.alpha = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
    }, duration);
  }

  export async function fadeOut(
    target: egret.DisplayObject,
    duration?: number,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
    }, duration);
    target.visible = false;
    target.alpha = 1;
  }

  export async function twirlIn(
    target: egret.DisplayObject,
    duration?: number,
  ): Promise<void> {
    target.alpha = 0;
    target.scaleX = 0;
    target.scaleY = 0;
    target.rotation = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      rotation: 1080,
    }, duration);
  }

  export async function twirlOut(
    target: egret.DisplayObject,
    duration?: number,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      rotation: -1080,
    }, duration);
    target.visible = false;
    target.alpha = 1;
    target.scaleX = 1;
    target.scaleY = 1;
    target.rotation = 1;
  }
}
