namespace game {
  /**
   * “好”声效
   */
  export class GoodSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("good_m4a");
    }
  }
}
