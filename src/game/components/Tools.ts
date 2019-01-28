namespace game {
  const SNAPSHOT_KEY = "YYW_G4_TOOLS";

  export class Tools extends yyw.Base {
    private valueUp: number = yyw.CONFIG.toolAmount;
    private shuffle: number = yyw.CONFIG.toolAmount;
    private breaker: number = yyw.CONFIG.toolAmount;
    private livesUp: number = yyw.CONFIG.toolAmount;

    public set targetRect(targetRect: egret.Rectangle) {
      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.targetRect = targetRect;
      });
    }

    public async startTool(useSnapshot?: boolean) {
      if (useSnapshot) {
        const snapshot = await yyw.getStorage(SNAPSHOT_KEY);
        if (snapshot) {
          Object.assign(this, snapshot);
        }
      }

      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.setAmount(this[tool.type]);
      });
    }

    protected destroy() {
      yyw.setStorage(SNAPSHOT_KEY, {
        valueUp: this.valueUp,
        shuffle: this.shuffle,
        breaker: this.breaker,
        livesUp: this.livesUp,
      });
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        yyw.on("ARENA_RUN", ({ data }: egret.Event) => {
          this.enabled = !data;
        });

        yyw.on("RANDOM_TOOL", () => {
          (yyw.randomChild(this.main) as ToolBase).increaseAmount(1);
        });

        this.initialized = true;
      }
    }
  }
}
