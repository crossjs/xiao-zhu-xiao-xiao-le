namespace yyw {
  export abstract class Base extends eui.Component implements eui.UIComponent {
    protected initialized: boolean = false;
    protected bg: eui.Image;
    protected body: eui.Group;

    public constructor() {
      super();

      this.addEventListener(
        egret.Event.ADDED_TO_STAGE,
        () => {
          if (this.initialized) {
            this.createView(false);
          }
        },
        this,
      );

      this.addEventListener(
        egret.Event.REMOVED_FROM_STAGE,
        () => {
          this.destroy();
        },
        this,
      );
    }

    protected abstract createView(fromChildrenCreated?: boolean): void;
    protected abstract destroy(): void;

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    protected childrenCreated(): void {
      super.childrenCreated();

      // 匹配高度
      if (this.bg) {
        this.bg.height = this.stage.stageHeight;
      }

      // 匹配刘海屏
      if (this.body) {
        const { statusBarHeight, pixelRatio } = CONFIG.systemInfo;
        if (statusBarHeight === 44 && pixelRatio === 3) {
          this.body.y = statusBarHeight * 2;
        } else {
          this.body.y = statusBarHeight;
        }
      }

      this.createView(true);
    }
  }
}
