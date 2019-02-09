namespace yyw {
  /**
   * 声效基类
   */
  export class Sound {
    public static play() {
      if (!this.instance) {
        this.instance = new this();
      }
      this.instance.play();
    }

    private static instance: Sound;

    protected url: string;
    protected sound: egret.Sound;

    public constructor() {
      egret.setTimeout(async () => {
        if (this.url) {
          this.sound = await loadAudio(this.url);
        }
      }, this, 0);
      (this.constructor as any).instance = this;
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
