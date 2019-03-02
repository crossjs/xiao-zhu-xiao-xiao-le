namespace yyw {
  /**
   * 声效基类
   */
  export class Sound {
    public static play() {
      if (this.instance) {
        this.instance.play();
      }
    }

    private static instance: Sound;

    protected sound: egret.Sound;

    public constructor(url: string) {
      if (url) {
        egret.setTimeout(async () => {
          this.sound = await loadAudio(url);
        }, null, 0);
        (this.constructor as any).instance = this;
      }
    }

    private play() {
      if (!CONFIG.soundEnabled) {
        return;
      }
      if (!this.sound) {
        return;
      }
      const soundChannel = this.sound.play(0, 1);
      soundChannel.once(
        egret.Event.SOUND_COMPLETE,
        () => {
          soundChannel.stop();
        },
        this,
      );
    }
  }
}
