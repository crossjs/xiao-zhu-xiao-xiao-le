namespace game {
  export class Base extends eui.Component implements eui.UIComponent {
    protected bg: eui.Image;
    protected body: eui.Group;

    public constructor() {
      super();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      // 匹配高度
      if (this.bg) {
        this.bg.height = this.stage.stageHeight;
      }

      // 匹配刘海屏
      if (this.body) {
        this.body.y = yyw.SYSTEM_INFO.statusBarHeight * 2;
      }
    }
  }
}
