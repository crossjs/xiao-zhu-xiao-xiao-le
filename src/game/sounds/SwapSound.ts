namespace game {
  /**
   * 切换声效
   */
  export class SwapSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("swap_m4a");
    }
  }
}
