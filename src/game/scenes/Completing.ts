namespace game {
  export class Completing extends yyw.Base {
    private tfdLevel: eui.BitmapLabel;
    private tfdSteps: eui.BitmapLabel;
    private btnOK: eui.Button;
    private gameData: {
      steps?: number,
    } = {
      steps: 0,
    };

    protected async initialize(): Promise<void> {
      // 放在这里注册，确保优先级
      yyw.on("GAME_DATA", ({ data: { steps } }: egret.Event) => {
        this.gameData = {
          steps,
        };
      });
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          const { windowWidth, windowHeight } = yyw.CONFIG;
          const { steps } = this.gameData;
          const { width, height } = this.main;
          const { x, y } = this.main.localToGlobal();
          const scaleX = windowWidth / 375;
          const scaleY = scaleX * windowHeight / 667;
          yyw.share({
            title: `噢耶！我 ${steps} 步就通过了关卡 ${yyw.CONFIG.level}`,
            imageUrl: canvas.toTempFilePathSync({
              x,
              y,
              width: width * scaleX,
              height: height * scaleY,
              destWidth: 500,
              destHeight: 400,
            }),
            ald_desc: "ending",
          });
        });

        yyw.onTap(this.btnEscape, () => {
          yyw.emit("GAME_START");
        });
      }

      const { steps } = this.gameData;

      const { levels, level } = yyw.CONFIG;

      this.tfdLevel.text = `${level}`;
      this.tfdSteps.text = `${levels[level].limit.steps - steps}`;

      yyw.CONFIG.level++;

      this.btnEscape.visible = false;
      await yyw.sleep();
      this.btnEscape.visible = true;
    }
  }
}
