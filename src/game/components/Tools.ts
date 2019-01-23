namespace game {
  const SNAPSHOT_KEY = "YYW_G4_TOOLS";

  export class Tools extends yyw.Base {
    private modal: eui.Group;
    private images: eui.Group;
    private tools: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private valueUp: number = 0;
    private shuffle: number = 0;
    private breaker: number = 0;
    private livesUp: number = 0;

    public set targetRect(targetRect: egret.Rectangle) {
      yyw.eachChild(this.tools, (tool: ToolBase) => {
        tool.targetRect = targetRect;
      });
    }

    public async showModal() {
      yyw.fadeIn(this.bg);
      await yyw.twirlIn(this.modal);
      this.btnOK.visible = true;
      this.btnKO.visible = true;
      this.animate();
    }

    public async hideModal() {
      this.btnOK.visible = false;
      this.btnKO.visible = false;
      yyw.fadeOut(this.bg);
      await yyw.twirlOut(this.modal);
    }

    protected destroy() {
      yyw.removeTweens(this.bg);
      yyw.removeTweens(this.modal);
      this.bg.visible = false;
      this.modal.visible = false;
      const { valueUp, shuffle, breaker, livesUp } = this;
      yyw.setStorage(SNAPSHOT_KEY, {
        valueUp,
        shuffle,
        breaker,
        livesUp,
      });
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      const snapshot = await yyw.getStorage(SNAPSHOT_KEY);
      if (snapshot) {
        Object.assign(this, snapshot);
      }

      if (fromChildrenCreated) {
        yyw.eachChild(this.tools, (tool: ToolBase) => {
          tool.addEventListener("USING", this.onToolUsing, this);
        });

        yyw.onTap(this.btnKO, () => {
          this.hideModal();
        });

        // 广告启用
        if (yyw.CONFIG.adEnabled) {
          // 有 UnitId
          if (yyw.CONFIG.adUnitId) {
            yyw.onTap(this.btnOK, async () => {
              // 看完视频广告后领道具
              const videoPlayed = await yyw.showVideoAd();
              if (videoPlayed) {
                await this.hideModal();
                this.getRandomTool();
              } else {
                if (videoPlayed === false) {
                  yyw.showToast("完整看完广告才能🉐道具");
                } else {
                  // yyw.showToast("当前没有可以播放的广告");
                  // 转发后领道具
                  if (await yyw.share()) {
                    await this.hideModal();
                    this.getRandomTool();
                  } else {
                    yyw.showToast("转发才能🉐道具");
                  }
                }
              }
            });
          } else {
            yyw.onTap(this.btnOK, async () => {
              // 转发后领道具
              if (await yyw.share()) {
                await this.hideModal();
                this.getRandomTool();
              } else {
                yyw.showToast("转发才能🉐道具");
              }
            });
          }
        }

        this.initialized = true;
      }

      yyw.eachChild(this.tools, (tool: ToolBase) => {
        tool.setNum(this[tool.type]);
      });
    }

    private onToolUsing({ data }: any) {
      this.dispatchEventWith("TOOL_USING", false, data);
    }

    private getRandomTool() {
      yyw.randomChild(this.tools).increaseNum(1);
    }

    private animate() {
      const n = this.images.numChildren;
      let currentIndex = 0;
      const tween = async () => {
        const image: any = this.images.getChildAt(currentIndex);
        yyw.setZIndex(image);
        await yyw.fadeIn(image, 2000);
        currentIndex = (currentIndex + 1) % n;
        if (this.modal.visible) {
          tween();
        }
      };
      if (this.modal.visible) {
        tween();
      }
    }
  }
}
