namespace game {
  /**
   * “完美”声效
   */
  export class ExcellentSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("excellent_mp3");
    }
  }
}
