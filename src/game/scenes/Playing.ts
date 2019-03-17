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

      const canTool = yyw.reward.can("tool");
      // 启用道具奖励
      if (canTool) {
        // 剩余步数过低
        yyw.on("LEAST", () => {
          if (this.isPlaying) {
            yyw.director.toScene("alarm", true);
          }
        });
      }

      const canRevive = yyw.reward.can("revive");
      // 剩余步数耗尽
      yyw.on("EMPTY", () => {
        if (this.isPlaying) {
          if (canRevive) {
            yyw.director.toScene("reviving", true);
          } else {
            this.gameLost();
          }
        }
      });

      // const canCoin = yyw.reward.can("coin");

      // // 启用金币奖励
      // if (canCoin) {
      //   yyw.on("NUM_COLLECTED", ({ data: { num }}) => {
      //     if (this.isPlaying) {
      //       // 获得魔法数字
      //       if (num === MAGIC_NUMBER) {
      //         yyw.director.toScene("award", true, (scene: Award) => {
      //           scene.setType("magic");
      //         });
      //         yyw.analysis.onRunning("award", "magic");
      //       } else if (num === BOMB_NUMBER) {
      //         yyw.director.toScene("award", true, (scene: Award) => {
      //           scene.setType("bomb");
      //         });
      //         yyw.analysis.onRunning("award", "bomb");
      //       }
      //     }
      //   });
      // }

      yyw.on("LEVEL_WON", () => {
        this.gameWon();
      });

      // 预处理龙骨动画
      Boom.init();
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

        this.initToolsTarget();

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
      const {
        score,
        maxCombo: combo,
      } = this.arena.getSnapshot();
      // 保存数据
      yyw.pbl.save({
        score,
        combo,
        level: yyw.CONFIG.level,
      });
      yyw.emit("LEVEL_WON");
      yyw.director.toScene("completing", true);
      yyw.analysis.onEnd();
    }

    /**
     * 失败
     */
    private gameLost() {
      this.isPlaying = false;
      const {
        score,
        maxCombo: combo,
      } = this.arena.getSnapshot();
      yyw.pbl.save({
        combo,
        score,
      });
      if (yyw.USER.arena && yyw.USER.arena[yyw.CONFIG.mode]) {
        // 清空快照
        yyw.update({
          arena: {
            ...yyw.USER.arena,
            // 只清当前模式
            [yyw.CONFIG.mode]: null,
          },
        });
      }
      yyw.director.toScene("ending", true);
      yyw.analysis.onEnd();
    }

    /**
     * 工具拖放区域
     */
    private initToolsTarget() {
      // const { x: left, y: top, width, height } = this.arena;
      const left = 0;
      const top = 322;
      const width = 720;
      const height = 720;
      const padding = 15;
      const rect = new egret.Rectangle(
        left + padding,
        // 因为 body 限制了高度 1072，且距离底部 262，所以是 1334，也就是界面的设计高度
        top + padding + this.stage.stageHeight - 1334,
        width - padding * 2,
        height - padding * 2,
      );
      this.tools.targetRect = rect;
    }
  }
}
