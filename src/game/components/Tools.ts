namespace game {
  const SNAPSHOT_KEY = "TOOLS";

  export class Tools extends yyw.Base {
    private toolValueUp: ToolBase;
    private toolShuffle: ToolBase;
    private toolBreaker: ToolBase;
    private toolLivesUp: ToolBase;
    private tools: ToolBase[];
    private valueUp: number = yyw.CONFIG.toolAmount;
    private shuffle: number = yyw.CONFIG.toolAmount;
    private breaker: number = yyw.CONFIG.toolAmount;
    private livesUp: number = yyw.CONFIG.toolAmount;

    public set targetRect(targetRect: egret.Rectangle) {
      this.tools.forEach((tool: ToolBase) => {
        tool.targetRect = targetRect;
      });
    }

    public async startup(useSnapshot?: boolean) {
      if (useSnapshot) {
        const snapshot = await yyw.db.get(SNAPSHOT_KEY);
        if (snapshot) {
          Object.assign(this, snapshot);
        }
      }

      this.tools.forEach((tool: ToolBase) => {
        tool.setAmount(this[tool.type]);
      });
    }

    protected destroy() {
      this.tools.forEach((tool: ToolBase) => {
        this[tool.type] = tool.getAmount();
      });
      yyw.db.set(SNAPSHOT_KEY, {
        valueUp: this.valueUp,
        shuffle: this.shuffle,
        breaker: this.breaker,
        livesUp: this.livesUp,
      });
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        this.tools = [
          this.toolValueUp,
          this.toolShuffle,
          this.toolBreaker,
          this.toolLivesUp,
        ];

        yyw.on("ARENA_RUN", ({ data: running }: egret.Event) => {
          this.enabled = !running;
        });
      }
    }
  }
}
