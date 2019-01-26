namespace game {
  const SNAPSHOT_KEY = "YYW_G4_TOOLS";

  export class Tools extends yyw.Base {
    private valueUp: number = 0;
    private shuffle: number = 0;
    private breaker: number = 0;
    private livesUp: number = 0;

    public set targetRect(targetRect: egret.Rectangle) {
      yyw.eachChild(this.body, (tool: ToolBase) => {
        tool.targetRect = targetRect;
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
      const snapshot = await yyw.getStorage(SNAPSHOT_KEY);
      if (snapshot) {
        Object.assign(this, snapshot);
      }

      if (fromChildrenCreated) {
        yyw.on("ARENA_RUN", ({ data }: egret.Event) => {
          this.enabled = !data;
        });

        yyw.on("RANDOM_TOOL", () => {
          (yyw.randomChild(this.body) as ToolBase).increaseAmount(1);
        });

        this.initialized = true;
      }

      yyw.eachChild(this.body, (tool: ToolBase) => {
        tool.setAmount(this[tool.type]);
      });
    }
  }
}
