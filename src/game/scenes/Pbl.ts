namespace game {
  export class Pbl extends yyw.Base {
    private btnRestart: eui.Button;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      try {
        const pbl = await yyw.pbl.me();
        Object.entries(pbl).forEach(([ key, value ]: [string, number]) => {
          const field: eui.BitmapLabel = this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`];
          if (field) {
            field.text = `${value}`;
          }
        });
      } catch (error) {
        yyw.showToast("当前无数据");
      }

      if (fromChildrenCreated) {
        yyw.on("RUN_CHANGE", ({ data: running }: egret.Event) => {
          this.enabled = !running;
        });

        yyw.onTap(this.btnRestart, async () => {
          if (await yyw.showModal("确定放弃当前进度？")) {
            yyw.director.escape();
            yyw.emit("GAME_START");
            yyw.analysis.onEnd("fail");
          }
        });
      }

      yyw.analysis.addEvent("9进入数据统计");
    }
  }
}
