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
        // 先建一个
        this.createSound();
        (this.constructor as any).instance = this;
      }
    }

    private async play() {
      if (!CONFIG.soundEnabled) {
        return;
      }
      if (!this.soundPool.length) {
        await this.createSound();
      }
      const sound = this.soundPool.pop();
      sound.play();
    }

    private async createSound() {
      const sound = wx.createInnerAudioContext();
      sound.src = await fs.ensure(this.url);
      sound.onEnded(() => {
        this.soundPool.unshift(sound);
      });
      this.soundPool.push(sound);
    }
  }
}
