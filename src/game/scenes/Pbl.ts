namespace game {
  export class Pbl extends yyw.Base {
    private btnHome: eui.Button;
    private btnRestart: eui.Button;

    // public async exiting() {
    //   await yyw.rightOut(this);
    // }

    // public async entering() {
    //   await yyw.rightIn(this);
    // }

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
        yyw.onTap(this.btnHome, () => {
          yyw.director.toScene("landing");
        });

        yyw.onTap(this.btnRestart, () => {
          yyw.director.toScene("playing", false, (scene: Playing) => {
            scene.startGame();
          });
        });
      }
    }
  }
}
