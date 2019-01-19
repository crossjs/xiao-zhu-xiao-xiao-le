namespace game {
  export class PromisedTween {
    public static get(target: any, options?: any) {
      return new PromisedTween(target, options);
    }

    public static removeTweens(target: any) {
      egret.Tween.removeTweens(target);
    }

    public static pauseTweens(target: any) {
      egret.Tween.pauseTweens(target);
    }

    public static resumeTweens(target: any) {
      egret.Tween.resumeTweens(target);
    }

    public static removeAllTweens() {
      egret.Tween.removeAllTweens();
    }

    private tween: egret.Tween;

    constructor(target: any, options: any = {}) {
      this.tween = egret.Tween.get(target, options);
    }

    public async to(
      props: any,
      duration: number = 100,
      ease: any = egret.Ease.quadOut,
    ): Promise<PromisedTween> {
      await new Promise((resolve) => {
        this.tween.setPaused(false).to(props, duration * SPEED_RATIO, ease).call(resolve);
      });
      return this;
    }
  }
}
