namespace game {
  export abstract class Base extends eui.Component implements eui.UIComponent {
    protected bg: eui.Image;
    protected body: eui.Group;
    protected initialized: boolean = false;

    public constructor() {
      super();

      this.addEventListener(
        egret.Event.ADDED_TO_STAGE,
        () => {
          if (this.initialized) {
            this.createView();
          }
        },
        this,
      );

      this.addEventListener(
        egret.Event.REMOVED_FROM_STAGE,
        () => {
          if (this.initialized) {
            if (this.destroy) {
              this.destroy();
              // this.destroy = null;
            }
          }
        },
        this,
      );
    }

    protected abstract createView(): void;
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
        this.body.y = yyw.WX_SYSTEM_INFO.statusBarHeight * 2;
      }
    }
  }
}
