namespace yyw {
  let clickFeedback = () => void 0;

  const hi = () => {
    vibrateShort();
    clickFeedback();
  };

  export function setClickFeedback(feedback: any) {
    clickFeedback = feedback;
  }

  export function onTap(
    target: egret.DisplayObject,
    handler: (e: egret.TouchEvent) => any,
    {
      priority = 0,
      mute = false,
      useCapture = false,
    }: {
      priority?: number,
      mute?: boolean,
      useCapture?: boolean,
    } = {},
  ): () => void {
    if (!mute) {
      target.addEventListener(
        egret.TouchEvent.TOUCH_BEGIN,
        hi,
        target,
        useCapture,
        priority,
      );
    }
    target.addEventListener(
      egret.TouchEvent.TOUCH_TAP,
      handler,
      target,
      useCapture,
      priority,
    );

    return () => {
      if (!mute) {
        target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, hi, target);
      }
      target.removeEventListener(egret.TouchEvent.TOUCH_TAP, handler, target);
    };
  }

  export function onDnd(
    target: egret.DisplayObject,
    begin: any,
    move: any,
    end: any,
    stage?: egret.DisplayObject,
  ): () => void {
    // 是否正在拖动
    let dragging: boolean = false;

    const cancel = () => {
      dragging = false;
    };

    const handleBegin = (e: egret.TouchEvent) => {
      dragging = true;
      begin(e, cancel);
    };

    const handleMove = (e: egret.TouchEvent) => {
      if (!dragging) {
        return;
      }
      move(e, cancel);
    };

    const handleEnd = (e: egret.TouchEvent) => {
      if (!dragging) {
        return;
      }
      cancel();
      end(e);
    };

    if (!stage) {
      stage = target;
    }

    target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, handleBegin, target);
    stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, handleMove, target);
    target.addEventListener(egret.TouchEvent.TOUCH_END, handleEnd, target);
    target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, handleEnd, target);

    return () => {
      target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, handleBegin, target);
      stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, handleMove, target);
      target.removeEventListener(egret.TouchEvent.TOUCH_END, handleEnd, target);
      target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, handleEnd, target);
    };
  }
}
