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
    private innerAudioContext: wx.InnerAudioContext;

    public constructor(url: string) {
      if (url) {
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.src = url;
        (this.constructor as any).instance = this;
      }
    }

    private play() {
      if (!CONFIG.soundEnabled) {
        return;
      }
      if (!this.innerAudioContext) {
        return;
      }

      this.innerAudioContext.play();
    }
  }
}
