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
        const { randomLine, randomKind, randomSort } = yyw.USER.tools;
        Object.assign(this.toolAmounts, { randomLine, randomKind, randomSort });
      }

      yyw.eachChild(this.main, (tool: ToolBase) => {
        tool.setAmount(this.toolAmounts[tool.type] || 0);
      });
    }

    public getSnapshot(): ToolAmount {
      return yyw.eachChild(this.main, (tool: ToolBase) => {
        return {
          [tool.type]: tool.getAmount(),
        };
      }).reduce((obj, kv) => Object.assign(obj, kv), {});
    }

    protected initialize() {
      yyw.on("RUN_CHANGE", ({ data: running }: egret.Event) => {
        this.enabled = !running;
      });
    }
  }
}
