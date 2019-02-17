class LoadingUI extends yyw.Base implements RES.PromiseTaskReporter {
  private percent: eui.Label;
  private bar: eui.Image;

  public onProgress(current: number, total: number, { root, name }: RES.ResourceInfo): void {
    if (this.initialized) {
      const percent = current / total;
      this.percent.text = `${Math.ceil(percent * 100)}%`;
      yyw.getTween(this.bar).to({
        width: Math.ceil(660 * percent),
      });
    }
  }
}
