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
        null,
      );

      this.addEventListener(
        egret.Event.REMOVED_FROM_STAGE,
        () => {
          this.destroy();
        },
        null,
      );

      this.initialize();
    }

    public async exiting() {
      await fadeOut(this);
    }

    public async entering() {
      await fadeIn(this);
    }

    protected initialize() {
      //
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
        yyw.onTap(this.bg, (e: egret.TouchEvent) => {
          e.stopPropagation();
        }, true);
      }

      // 匹配刘海屏
      if (this.body) {
        const { system, statusBarHeight } = CONFIG.systemInfo;
        // yyw.showToast(`SBH: ${statusBarHeight}`);
        let top: number;
        if (/android/i.test(system)) {
          top = statusBarHeight > 18 ? 88 : 33;
        } else {
          top = statusBarHeight > 20 ? statusBarHeight * 2 : 20;
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
