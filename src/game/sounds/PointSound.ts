namespace game {
  /**
   * 得分声效
   */
  export class PointSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("point_m4a");
    }
  }
}
