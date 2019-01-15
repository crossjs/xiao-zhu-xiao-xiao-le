namespace game {
  /**
   * “棒”声效
   */
  export class GreatSound extends SoundBase {
    public constructor() {
      super();
      this.sound = RES.getRes("great_mp3");
    }
  }
}
