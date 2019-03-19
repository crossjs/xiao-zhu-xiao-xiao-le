namespace game {
  interface ToolAmount {
    randomLine: number;
    randomKind: number;
    randomSort: number;
  }

  export class Tools extends yyw.Base {
    private toolAmounts: ToolAmount = {
      randomLine: yyw.CONFIG.toolAmount,
      randomKind: yyw.CONFIG.toolAmount,
      randomSort: yyw.CONFIG.toolAmount,
    };

    public async startup(useSnapshot: boolean = false) {
      if (useSnapshot) {
        const { randomLine, randomKind, randomSort } = yyw.USER.arena;
        Object.assign(this.toolAmounts, { randomLine, randomKind, randomSort });
      }

      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.setAmount(this.toolAmounts[tool.type] || 0);
      });
    }

    public getSnapshot(): ToolAmount {
      yyw.eachChild(this.main, (tool: ToolBase) => {
        this.toolAmounts[tool.type] = tool.getAmount();
      });
      const { randomLine, randomKind, randomSort } = this.toolAmounts;
      return { randomLine, randomKind, randomSort };
    }

    protected initialize() {
      yyw.on("RUN_CHANGE", ({ data: running }: egret.Event) => {
        this.enabled = !running;
      });
    }
  }
}
