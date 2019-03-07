namespace game {
  export class Ending extends yyw.Base {
    private btnOK: eui.Button;
    private gameData: {
      level?: number,
      combo?: number,
      score?: number,
    } = {
      level: 0,
      combo: 0,
      score: 0,
    };

    protected async initialize(): Promise<void> {
      // 放在这里注册，确保优先级
      yyw.on("GAME_DATA", ({ data: { score, level, combo } }: egret.Event) => {
        this.gameData = {
          score,
          level,
          combo: Math.max(combo, this.gameData.combo),
        };
      });
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          const { windowWidth, windowHeight } = yyw.CONFIG;
          const { score, combo } = this.gameData;
          const { width, height } = this.main;
          const { x, y } = this.main.localToGlobal();
          const scaleX = windowWidth / 375;
          const scaleY = scaleX * windowHeight / 667;
          yyw.share({
            title: `噢耶！我得到了 ${score} 分与 ${combo} 次连击`,
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
          yyw.emit("RESTART");
        });
      }

      Object.entries(this.gameData).forEach(([ key, value ]: [string, number]) => {
        const field: eui.BitmapLabel = this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`];
        if (field) {
          field.text = `${value}`;
        }
      });

      this.btnEscape.visible = false;
      await yyw.sleep();
      this.btnEscape.visible = true;

      yyw.emit("GAME_OVER");
      yyw.analysis.onEnd();
    }
  }
}
