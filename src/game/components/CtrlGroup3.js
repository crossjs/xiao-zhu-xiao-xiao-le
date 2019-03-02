var game;
(function (game) {
    class CtrlGroup3 extends yyw.Base {
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.onTap(this.btnSound, () => {
                    const { selected } = this.btnSound;
                    this.btnSound.currentState = selected ? "selected" : "up";
                    yyw.CONFIG.soundEnabled = selected;
                });
                this.btnSound.selected = true;
                const canVibrate = !/^iPhone (?:4|5|6)/i.test(yyw.CONFIG.systemInfo.model);
                if (canVibrate) {
                    yyw.onTap(this.btnVibration, () => {
                        const { selected } = this.btnVibration;
                        this.btnVibration.currentState = selected ? "selected" : "up";
                        yyw.CONFIG.vibrationEnabled = selected;
                    });
                }
                else {
                    this.btnVibration.currentState = "disabled";
                    yyw.CONFIG.vibrationEnabled = false;
                }
            }
        }
    }
    game.CtrlGroup3 = CtrlGroup3;
})(game || (game = {}));
