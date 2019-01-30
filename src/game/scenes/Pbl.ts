namespace game {
  export class Pbl extends yyw.Base {
    private btnBack: eui.Button;
    private btnHome: eui.Button;
    private btnRestart: eui.Button;
    private btnSound: eui.ToggleButton;
    private btnVibration: eui.ToggleButton;

    public async exiting() {
      await yyw.rightOut(this);
    }

    public async entering() {
      await yyw.rightIn(this);
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      try {
        const pbl = await yyw.pbl.get();
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
        yyw.onTap(this.btnBack, () => {
          SceneManager.escape();
        });

        yyw.onTap(this.btnHome, () => {
          SceneManager.toScene("landing");
        });

        yyw.onTap(this.btnRestart, () => {
          SceneManager.toScene("playing", false, (scene: Playing) => {
            scene.startGame();
          });
        });

        // 声音
        yyw.onTap(this.btnSound, () => {
          const { selected } = this.btnSound;
          this.btnSound.currentState = selected ? "selected" : "up";
          yyw.CONFIG.soundEnabled = selected;
        });

        // 振动
        yyw.onTap(this.btnVibration, () => {
          const { selected } = this.btnVibration;
          this.btnVibration.currentState = selected ? "selected" : "up";
          yyw.CONFIG.vibrationEnabled = selected;
        });

        this.initialized = true;
      }
    }
  }
}
