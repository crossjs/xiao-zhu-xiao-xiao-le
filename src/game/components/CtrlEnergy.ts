namespace game {
  export class CtrlEnergy extends yyw.Base {
    // private img: eui.Image;
    private tfd: eui.BitmapLabel;
    private btn: eui.Image;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.btn, () => {
          // todo 金币兑换体力
        });

        this.tfd.text = `${yyw.EnergySys.getAmount()}`;

        yyw.on("ENERGY_CHANGE", ({ data: { amount }}) => {
          this.tfd.text = `${amount}`;
        });
      }
    }
  }
}
