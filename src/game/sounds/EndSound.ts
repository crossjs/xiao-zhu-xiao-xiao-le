namespace game {
  /**
   * 游戏结束声效
   */
  export class EndSound extends SoundBase {
    public constructor() {
      super();
      this.sound = RES.getRes("end_mp3");
    }
  }
}
