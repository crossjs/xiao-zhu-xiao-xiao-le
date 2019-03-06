class Loading extends yyw.Base {
  private percent: eui.Label;
  private bar: eui.Image;
  private tip: eui.Label;
  private tips: string[] = [
    "连续消除得「💰」奖励",
    "「💰」可以兑换「🎁」",
    "五个「🔢」一条线合成「🍭」",
    "合成「🍭」得「💰」奖励",
  ];
  private index: number = yyw.random(4);

  constructor(private baseMap: any) {
    super();
  }

  public setProgress(type: string, current: number, total: number): void {
    if (this.initialized) {
      const base = this.baseMap[type];
      const percent = (current / total) * (1 - base) + base;
      this.percent.text = `${type}`;
      this.bar.width = Math.ceil(654 * percent);
    }
    // egret.log(type, current, total);
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
