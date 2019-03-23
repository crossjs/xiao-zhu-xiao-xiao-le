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
    private soundPool: wx.InnerAudioContext[] = [];

    public constructor(private url: string) {
      if (this.url) {
        (this.constructor as any).instance = this;
      }
    }

    private async play() {
      if (!CONFIG.soundEnabled) {
        return;
      }
      const sound = this.soundPool.pop() || await this.createSound();
      sound.play();
    }

    private async createSound(): Promise<wx.InnerAudioContext> {
      const sound = wx.createInnerAudioContext();
      sound.src = await fs.ensure(this.url);
      sound.onEnded(() => {
        this.soundPool.unshift(sound);
      });
      return sound;
    }
  }
}
