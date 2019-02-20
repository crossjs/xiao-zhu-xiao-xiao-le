class LoadingUI extends yyw.Base implements RES.PromiseTaskReporter {
  private percent: eui.Label;
  private bar: eui.Image;
  private tip: eui.Label;
  private tips: string[] = [
    "合成「波板糖」可得「金币」",
    "直线五个数字可合成「波板糖」",
    "「金币」可兑换「道具」或「实物」",
  ];
  private index: number = yyw.random(2);

  public onProgress(current: number, total: number): void {
    if (this.initialized) {
      const percent = current / total;
      this.percent.text = `${Math.ceil(percent * 100)}%`;
      this.bar.width = Math.ceil(654 * percent);
    }
  }

  protected async createView(fromChildrenCreated?: boolean): Promise<void> {
    super.createView(fromChildrenCreated);

    if (fromChildrenCreated) {
      let count = 0;
      const update = () => {
        this.tip.text = this.tips[this.index++ % this.tips.length];
        if (++count < 3) {
          egret.setTimeout(update, null, 3000);
        }
      };
      update();
    }
  }
}
