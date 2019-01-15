namespace game {
  /**
   * “好”声效
   */
  export class GoodSound extends SoundBase {
    public constructor() {
      super();
      this.sound = RES.getRes("good_mp3");
    }
  }
}
