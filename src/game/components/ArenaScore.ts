namespace game {
  export class ArenaScore extends ArenaBase {
    protected mode: string = "score";
    private b1: eui.Image;
    /** 剩余步数值 */
    private steps: number = 5;
    private offNumMerged: () => void;

    public getSnapshot() {
      const { steps } = this;
      return {
        steps,
        ...super.getSnapshot(),
      };
    }

    protected onSwap(hasChain: boolean) {
      if (!hasChain) {
        this.increaseSteps(-1);
      }
    }

    protected onToolUsing(e: egret.Event) {
      const { data: {
        type,
        amount = 1,
        confirm,
        cancel,
      } } = e;
      if (type === "stepsUp") {
        if (this.steps >= 5) {
          if (cancel) {
            return cancel();
          }
          return yyw.showToast("剩余步数已满");
        }
        return this.doStepsUp(confirm, amount);
      }
      super.onToolUsing(e);
    }

    protected ensureData(useSnapshot: boolean) {
      this.steps = useSnapshot && yyw.USER.arena!.score!.steps || this.steps;
      this.increaseSteps(0);
      super.ensureData(useSnapshot);
    }

    protected getGameData() {
      return {
        steps: this.steps,
        ...super.getGameData(),
      };
    }

    /**
     * 更新剩余步数及其显示
     */
    private increaseSteps(n: number) {
      this.steps = Math.max(0, Math.min(5, this.steps + n));
      for (let step = 1; step <= 5; step++) {
        const b: eui.Image = this[`b${step}`];
        if (step <= this.steps) {
          yyw.nude(b);
        } else {
          yyw.gray(b);
        }
      }
      if (n < 0) {
        if (this.steps === 1) {
          // 剩余步数过低
          yyw.emit("LEAST");
          this.blinkSteps();
        } else if (this.steps === 0) {
          // 剩余步数耗尽
          yyw.emit("EMPTY");
        }
      }
    }

    private async blinkSteps() {
      await yyw.zoomOut(this.b1, 300);
      await yyw.zoomIn(this.b1, 200);
      if (this.steps === 1) {
        this.blinkSteps();
      }
    }

    /**
     * 增加剩余步数
     */
    private doStepsUp(confirm: any, amount: number): void {
      // 确定消费
      confirm();
      // 开始工作
      this.increaseSteps(amount);
    }
  }
}
