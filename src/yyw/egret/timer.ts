namespace yyw {
  export async function sleep(delay: number = 1) {
    return new Promise((resolve) => {
      const timer: egret.Timer = new egret.Timer(delay * 1000 * CONFIG.speedRatio, 1);
      timer.once(egret.TimerEvent.TIMER_COMPLETE, resolve, null);
      timer.start();
    });
  }
}
