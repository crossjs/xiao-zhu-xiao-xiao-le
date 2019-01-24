namespace game {
  /**
   * 获得金币声效
   */
  export class CoinsSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("coins_m4a");
    }
  }
}
