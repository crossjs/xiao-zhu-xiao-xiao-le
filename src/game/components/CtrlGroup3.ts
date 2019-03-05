namespace game {
  export class CtrlGroup3 extends yyw.Base {
    private btnSound: eui.ToggleButton;
    private btnVibration: eui.ToggleButton;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        // 声音
        yyw.onTap(this.btnSound, () => {
          const { selected } = this.btnSound;
          this.btnSound.currentState = selected ? "selected" : "up";
          yyw.CONFIG.soundEnabled = selected;
        });
        this.btnSound.selected = true;

        const canVibrate = !/^iPhone (?:4|5|6)/i.test(yyw.CONFIG.systemInfo.model);
        if (canVibrate) {
          // 振动
          yyw.onTap(this.btnVibration, () => {
            const { selected } = this.btnVibration;
            this.btnVibration.currentState = selected ? "selected" : "up";
            yyw.CONFIG.vibrationEnabled = selected;
          });
          this.btnVibration.selected = true;
        } else {
          this.btnVibration.currentState = "disabled";
          yyw.CONFIG.vibrationEnabled = false;
        }
      }
    }
  }
}
