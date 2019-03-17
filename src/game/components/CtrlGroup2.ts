namespace game {
  export class CtrlGroup2 extends yyw.Base {
    private btnBoard: eui.ToggleButton;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.on("RUN_CHANGE", ({ data: running }: egret.Event) => {
          this.enabled = !running;
        });

        // 排行榜
        yyw.onTap(this.btnBoard, () => {
          yyw.director.toScene("ranking", true);
        });
      }
    }
  }
}
