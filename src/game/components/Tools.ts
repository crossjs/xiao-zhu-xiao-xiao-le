namespace game {
  interface ToolAmount {
    valueUp: number;
    shuffle: number;
    breaker: number;
    livesUp: number;
  }

  export class Tools extends yyw.Base {
    private toolAmounts: ToolAmount = {
      valueUp: yyw.CONFIG.toolAmount,
      shuffle: yyw.CONFIG.toolAmount,
      breaker: yyw.CONFIG.toolAmount,
      livesUp: yyw.CONFIG.toolAmount,
    };

    public set targetRect(targetRect: egret.Rectangle) {
      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.targetRect = targetRect;
      });
    }

    public async startup(useSnapshot?: boolean) {
      if (useSnapshot) {
        const { valueUp, shuffle, breaker, livesUp } = yyw.USER.arena;
        Object.assign(this.toolAmounts, { valueUp, shuffle, breaker, livesUp });
      }

      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.setAmount(this.toolAmounts[tool.type]);
      });
    }

    public getSnapshot(): ToolAmount {
      yyw.eachChild(this.main, (tool: ToolBase) => {
        this.toolAmounts[tool.type] = tool.getAmount();
      });
      return this.toolAmounts;
    }

    protected initialize() {
      yyw.on("ARENA_RUN", ({ data: running }: egret.Event) => {
        this.enabled = !running;
      });
    }
  }
}
