namespace game {
  /**
   * “完美”声效
   */
  export class ExcellentSound extends SoundBase {
    public constructor() {
      super();
      this.sound = RES.getRes("excellent_mp3");
    }
  }
}
