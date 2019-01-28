namespace yyw {
  /**
   * 按钮点击声效
   */
  class ClickSound extends Sound {
    public constructor() {
      super();
      this.sound = RES.getRes("click_m4a");
    }
  }

  export function playClick() {
    ClickSound.play();
  }
}