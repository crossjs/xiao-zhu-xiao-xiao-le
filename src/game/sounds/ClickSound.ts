namespace game {
  /**
   * 按钮点击声效
   */
  export class ClickSound extends yyw.Sound {
  }

  yyw.setClickFeedback(() => {
    ClickSound.play();
  });
}
