namespace game {
  /**
   * 魔法声效
   */
  export class MagicSound extends yyw.Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("magic_mp3");
    }
  }
}
