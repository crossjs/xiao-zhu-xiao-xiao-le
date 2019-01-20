namespace game {
  /**
   * 切换声效
   */
  export class SwitchSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("switch_mp3");
    }
  }
}
