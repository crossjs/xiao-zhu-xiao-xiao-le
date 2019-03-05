namespace yyw {
  export abstract class Base extends eui.Component implements eui.UIComponent {
    protected initialized: boolean = false;
    protected detached: boolean = true;
    protected bg: eui.Rect;
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
      this.detached = true;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        this.initialized = true;
      }
      this.detached = false;
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
        }, { mute: true, priority: -1 });
      }

      if (this.btnEscape) {
        onTap(this.btnEscape, () => {
          director.escape();
        }, { priority: -1 });
      }

      this.createView(true);
    }
  }
}
