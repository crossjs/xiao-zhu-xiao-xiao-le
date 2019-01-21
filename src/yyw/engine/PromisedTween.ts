namespace yyw {
  export class PromisedTween {
    public static get(target: any) {
      return new PromisedTween(target);
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
}
