namespace game {
  interface ToolAmount {
    shuffle: number;
  }

  export class Tools extends yyw.Base {
    private toolAmounts: ToolAmount = {
      shuffle: yyw.CONFIG.toolAmount,
    };

    public async startup(useSnapshot: boolean = false) {
      if (useSnapshot) {
        const { shuffle } = yyw.USER.arena[yyw.CONFIG.mode];
        Object.assign(this.toolAmounts, { shuffle });
      }

      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.setAmount(this.toolAmounts[tool.type] || 0);
      });
    }

    public getSnapshot(): ToolAmount {
      yyw.eachChild(this.main, (tool: ToolBase) => {
        this.toolAmounts[tool.type] = tool.getAmount();
      });
      const { shuffle } = this.toolAmounts;
      return { shuffle };
    }

    protected initialize() {
      yyw.on("RUN_CHANGE", ({ data: running }: egret.Event) => {
        this.enabled = !running;
      });
    }
  }
}
