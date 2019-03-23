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

    public constructor(private url: string) {
      if (this.url) {
        (this.constructor as any).instance = this;
      }
    }

    private async play() {
      if (!CONFIG.soundEnabled) {
        return;
      }
      const sound = wx.createInnerAudioContext();
      sound.src = await fs.ensure(this.url);
      sound.onEnded(() => {
        sound.destroy();
      });
      sound.play();
    }
  }
}
