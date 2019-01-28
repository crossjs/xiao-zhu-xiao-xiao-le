class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
  private tfd1: egret.TextField;
  private tfd2: egret.TextField;
  private tfd3: egret.TextField;

  public constructor() {
    super();

    this.tfd1 = new egret.TextField();
    this.addChild(this.tfd1);
    this.tfd1.y = 300;
    this.tfd1.width = 750;
    this.tfd1.height = 80;
    this.tfd1.textAlign = "center";
    this.tfd1.text = "资源加载中……";

    this.tfd2 = new egret.TextField();
    this.addChild(this.tfd2);
    this.tfd2.y = 380;
    this.tfd2.width = 750;
    this.tfd2.height = 60;
    this.tfd2.textAlign = "center";

    this.tfd3 = new egret.TextField();
    this.addChild(this.tfd3);
    this.tfd3.y = 440;
    this.tfd3.width = 750;
    this.tfd3.height = 60;
    this.tfd3.textAlign = "center";
  }

  public onProgress(current: number, total: number, { root, name }: RES.ResourceInfo): void {
    this.tfd2.text = `${current}/${total}`;
    this.tfd3.text = `${root}/${name}`;
  }
}
