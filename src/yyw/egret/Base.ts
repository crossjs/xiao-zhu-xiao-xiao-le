namespace yyw {
  export abstract class Base extends eui.Component implements eui.UIComponent {
    protected initialized: boolean = false;
    protected bg: eui.Image;
    protected body: eui.Group;
    protected main: eui.Group;
    protected btnEscape: eui.Image;

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

    public async exiting() {
      await fadeOut(this);
    }

    public async entering() {
      await fadeIn(this);
    }

    protected destroy() {
      //
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        this.initialized = true;
      }
    }

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
        const { system, statusBarHeight } = CONFIG.systemInfo;
        // yyw.showToast(`SBH: ${statusBarHeight}`);
        let top = 20;
        // 刘海屏（iPhoneX 为 44，华为 mate20 为 25）
        // 超过这个数，统一认定为有刘海
        if (statusBarHeight >= 25) {
          top = statusBarHeight * 2;
        } else {
          // 胶囊与屏幕顶部的距离
          top = /android/i.test(system) ? 32 : 20;
        }
        this.body.y = top;
        this.body.height = this.stage.stageHeight - top;
      }

      if (this.btnEscape) {
        onTap(this.btnEscape, () => {
          director.escape();
        });
      }

      this.createView(true);
    }
  }
}
