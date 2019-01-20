namespace game {
  /**
   * “棒”声效
   */
  export class GreatSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("great_mp3");
    }
  }
}
