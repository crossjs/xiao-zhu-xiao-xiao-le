namespace game {
  /**
   * 声效基类
   */
  export class SoundBase {
    protected sound: egret.Sound;

    public play() {
      if (yyw.getMute()) {
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

    public stop() {
      // empty
    }
  }
}
