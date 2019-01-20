namespace game {
  /**
   * “佩服”声效
   */
  export class AmazingSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("amazing_mp3");
    }
  }
}
