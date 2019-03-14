namespace game {
  export class ArenaLevel extends ArenaBase {
    protected mode: string = "level";
    private tfdLevel: eui.BitmapLabel;
    private tfdSteps: eui.BitmapLabel;
    private tfdGoals: eui.BitmapLabel;
    /** 剩余步数值 */
    private steps: number = 0;
    private limit: any;
    private goals: any;
    private merged: {
      [num: string]: number;
    } = {};
    private combos: number = 0;
    private timeoutHandle: number = null;
    private offGameData: () => void;
    private offNumMerged: () => void;

    public getSnapshot() {
      return {
        steps: this.steps,
        combos: this.combos,
        merged: this.merged,
        ...super.getSnapshot(),
      };
    }

    protected onSwap(hasChain: boolean) {
      this.increaseSteps(-1);
    }

    protected onToolUsing(e: egret.Event) {
      const { data: {
        type,
        amount = 1,
        confirm,
        cancel,
      } } = e;
      if (type === "stepsUp") {
        if (this.steps + amount > this.limit.steps) {
          if (cancel) {
            return cancel();
          }
          return yyw.showToast("超出关卡步数上限");
        }
        return this.doStepsUp(confirm, amount);
      }
      super.onToolUsing(e);
    }

    protected ensureData(useSnapshot: boolean) {
      Object.assign(this, yyw.CONFIG.levels[yyw.CONFIG.level - 1]);

      this.steps = useSnapshot && yyw.USER.arena.level.steps || this.limit.steps;
      this.combos = useSnapshot && yyw.USER.arena.level.combos || 0;
      this.merged = useSnapshot && yyw.USER.arena.level.merged || {};

      const { score, combo, merge } = this.goals;

      const strArr = [];
      if (score) {
        strArr.push(`获得：${score} 分`);
      }
      if (combo && combo.length) {
        strArr.push(`${combo[0]} 连击：${combo[1]} 次`);
      }
      if (merge && merge.length) {
        strArr.push(`合成 ${merge[0]}：${merge[1]} 次`);
      }

      this.tfdLevel.text = `${yyw.CONFIG.level}`;
      this.tfdSteps.text = `${this.steps}`;
      this.tfdGoals.text = strArr.join("\n");

      if (yyw.USER.guided) {
        yyw.showModal(
          [
            `${this.limit.steps} 步内`,
            ...strArr,
          ].join("，"),
          false,
        );
      }

      this.increaseSteps(0);
      super.ensureData(useSnapshot);
    }

    protected getGameData() {
      return {
        steps: this.steps,
        ...super.getGameData(),
      };
    }

    protected addListeners() {
      if (!this.offGameData) {
        this.offGameData = yyw.on("GAME_DATA", ({ data: { score, combo } }) => {
          if (this.goals.combo) {
            if (combo >= this.goals.combo[0]) {
              this.combos++;
            }
          }

          const isScoreSatisfied = !this.goals.score
            || score >= this.goals.score;

          const isComboSatisfied = !this.goals.combo
            || this.combos >= this.goals.combo[1];

          const isMergeSatisfied = !this.goals.merge
            || this.merged[this.goals.merge[0]] >= this.goals.merge[1];

          if (isScoreSatisfied && isComboSatisfied && isMergeSatisfied) {
            if (this.timeoutHandle) {
              egret.clearTimeout(this.timeoutHandle);
              this.timeoutHandle = null;
            }
            yyw.emit("LEVEL_COMPLETE");
          }
        });
      }
      if (!this.offNumMerged) {
        this.offNumMerged = yyw.on("NUM_MERGED", ({ data: { num }}) => {
          if (this.goals.merge && this.goals.merge[0] === num) {
            const key = `${num}`;
            const times = this.merged[key] || 0;
            this.merged[key] = times + 1;
          }
        });
      }
      super.addListeners();
    }

    protected removeListeners() {
      if (this.offGameData) {
        this.offGameData();
        this.offGameData = null;
      }
      if (this.offNumMerged) {
        this.offNumMerged();
        this.offNumMerged = null;
      }
      super.removeListeners();
    }

    /**
     * 更新剩余步数及其显示
     */
    private increaseSteps(n: number) {
      this.steps += n;
      this.tfdSteps.text = `${this.steps}`;
      if (n < 0) {
        this.timeoutHandle = egret.setTimeout(() => {
          if (this.steps === 1) {
            // 剩余步数过低
            yyw.emit("LEAST");
          } else if (this.steps === 0) {
            // 剩余步数耗尽
            yyw.emit("EMPTY");
          }
        }, null, 0);
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
