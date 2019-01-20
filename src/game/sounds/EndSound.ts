namespace game {
  /**
   * 游戏结束声效
   */
  export class EndSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("end_m4a");
    }
  }
}
