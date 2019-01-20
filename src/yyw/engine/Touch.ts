namespace yyw {
  export function onTap(target: any, handler: any, thisObj?: any) {
    target.addEventListener(
      egret.TouchEvent.TOUCH_BEGIN,
      () => {
        vibrateShort();
        playClick();
      },
      this,
    );
    target.addEventListener(
      egret.TouchEvent.TOUCH_TAP,
      handler,
      thisObj || target,
    );
  }
}
