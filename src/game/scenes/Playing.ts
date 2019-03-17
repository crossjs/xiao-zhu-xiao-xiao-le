namespace game {
  export class Playing extends yyw.Base {
    private bgHead: eui.Rect;
    private boxAll: box.All;
    private ctrlShop: CtrlShop;
    private arena: ArenaBase;
    private tools: Tools;
    private isPlaying: boolean = false;

    public async startGame() {
      const useSnapshot = yyw.USER.arena
        && yyw.USER.arena[yyw.CONFIG.mode]
        && (await yyw.showModal("继续上一次的进度？"));

      const Arena = yyw.CONFIG.mode === "score" ? ArenaScore : ArenaLevel;
      if (!(this.arena instanceof Arena)) {
        if (this.arena) {
          yyw.removeElement(this.arena);
        }
        this.arena = new Arena();
        this.body.addChildAt(this.arena, 1);
      }

      await this.arena.startup(useSnapshot);
      await this.tools.startup(useSnapshot);

      if (yyw.USER.arena && yyw.USER.arena[yyw.CONFIG.mode]) {
        // 清空快照
        await yyw.update({
          arena: {
            ...yyw.USER.arena,
            // 只清当前模式
            [yyw.CONFIG.mode]: null,
          },
        });
      }

      this.isPlaying = true;
      yyw.analysis.onStart();
    }

    public async exiting() {
      // no animation
    }

    protected initialize() {
      yyw.on("GAME_START", () => {
        this.startGame();
      });

      yyw.on("LEVEL_WON", () => {
        this.gameWon();
      });

      // 预处理龙骨动画
      yyw.Boom.init();
    }

    protected async destroy(): Promise<void> {
      if (this.isPlaying) {
        yyw.update({
          arena: {
            ...yyw.USER.arena,
            [yyw.CONFIG.mode]: {
              ...this.arena.getSnapshot(),
              ...this.tools.getSnapshot(),
            },
          },
        });
      }

      yyw.removeElement(this.arena);
      this.arena = null;

      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        if (yyw.USER.guided) {
          if (yyw.CONFIG.mode === "score") {
            yyw.director.toScene("task", true);
          }
        } else {
          yyw.director.toScene("guide", true);
        }

        if (yyw.CONFIG.shopStatus) {
          if (this.stage.stageHeight > 1334) {
            this.ctrlShop.x = 729 - this.ctrlShop.width;
          }
          this.ctrlShop.visible = true;
        }

        // 初次进入，刷新广告
        if (!(await yyw.showBannerAd())) {
          // 没有广告，显示交叉营销
          this.boxAll = new box.All();
          this.boxAll.bottom = 0;
          this.addChild(this.boxAll);
        }

        // 头部背景色
        yyw.noise(this.bgHead);
      }

      yyw.analysis.addEvent("9进入游戏界面");
    }

    /**
     * 完成关卡
     */
    private gameWon() {
      this.isPlaying = false;
      // 保存数据
      yyw.pbl.save({
        level: yyw.CONFIG.level,
      });
      yyw.director.toScene("completing", true);
      yyw.analysis.onEnd();
    }
  }
}
