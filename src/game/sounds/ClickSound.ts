namespace game {
  /**
   * 按钮点击声效
   */
  export class ClickSound extends yyw.Sound {
    protected url: string = "cloud://dev-529ffe.6465-dev-529ffe/amazing.m4a";
  }

  yyw.setClickFeedback(() => {
    ClickSound.play();
  });
}
