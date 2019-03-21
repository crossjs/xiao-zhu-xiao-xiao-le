namespace game {
  export class Playing extends yyw.Base {
    private bgHead: eui.Rect;
    private boxAll: box.All;
    private ctrlShop: CtrlCoin;
    private arena: ArenaBase;
    private tools: Tools;
    private isPlaying: boolean = false;

    public async startGame() {
      const useSnapshot = yyw.USER.arena
        && yyw.USER.arena[yyw.CONFIG.mode]
        && (await yyw.showModal("继续上一次的进度？"));

      if (!useSnapshot) {
        if (!yyw.EnergySys.use()) {
          if (await yyw.showModal("体力不足", false)) {
            this.isPlaying = false;
            yyw.director.toScene("landing");
          }
          return;
        }
      }

      await this.ensureArena(useSnapshot);
      await this.ensureTools(useSnapshot);

      this.isPlaying = true;
    }

    public async exiting() {
      // no animation
    }

    protected initialize() {
      yyw.on("GAME_START", () => {
        this.startGame();
        yyw.analysis.onStart();
      });

      yyw.on("LEVEL_PASS", () => {
        this.isPlaying = false;
        // 通关，清理快照
        this.saveSnapshot(null);
        yyw.director.toScene("pass", true);
        yyw.analysis.onEnd();
      });

      // 实时保存快照
      yyw.on("SNAPSHOT", ({ data }) => {
        this.saveSnapshot(data);
      });

      // 预处理龙骨动画
      yyw.Boom.init();
    }

    protected async destroy(): Promise<void> {
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

    private async ensureArena(useSnapshot: boolean) {
      const Arena = yyw.CONFIG.mode === "score" ? ArenaScore : ArenaLevel;
      if (!(this.arena instanceof Arena)) {
        if (this.arena) {
          yyw.removeElement(this.arena);
        }
        this.arena = new Arena();
        this.body.addChildAt(this.arena, 1);
      }

      await this.arena.startup(useSnapshot);
    }

    private async ensureTools(useSnapshot: boolean) {
      await this.tools.startup(useSnapshot);
    }

    private async saveSnapshot(payload: any) {
      const { arena } = yyw.USER;
      const { mode } = yyw.CONFIG;
      await yyw.update({
        tools: this.tools.getSnapshot(),
        arena: {
          ...arena,
          [mode]: payload,
        },
      });
    }
  }
}
