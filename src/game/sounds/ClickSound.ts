namespace game {
  /**
   * 按钮点击声效
   */
  export class ClickSound extends yyw.Sound {
    protected url: string = `${yyw.CONFIG.serverOrigin}/file/click.m4a`;
  }

  yyw.setClick(() => {
    ClickSound.play();
  });
}
