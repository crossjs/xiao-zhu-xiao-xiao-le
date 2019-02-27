namespace game {
  export class CtrlGroup2 extends yyw.Base {
    private btnCheckin: eui.ToggleButton;
    private btnBoard: eui.ToggleButton;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.on("ARENA_RUN", ({ data: running }: egret.Event) => {
          this.enabled = !running;
        });

        // 每日签到
        yyw.onTap(this.btnCheckin, () => {
          yyw.director.toScene("checkin", true);
        });

        // 排行榜
        yyw.onTap(this.btnBoard, () => {
          yyw.director.toScene("ranking", true);
        });
      }
    }
  }
}
