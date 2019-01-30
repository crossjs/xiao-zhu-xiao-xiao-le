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

    protected sound: egret.Sound;

    public play() {
      if (!CONFIG.soundEnabled) {
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
