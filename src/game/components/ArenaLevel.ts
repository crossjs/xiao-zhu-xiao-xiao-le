namespace game {
  interface Goals {
    [num: string]: number;
  }

  export class ArenaLevel extends ArenaBase {
    protected mode: string = "level";
    private tfdLevel: eui.BitmapLabel;
    private goals: Goals = {};

    public getSnapshot() {
      return {
        goals: this.goals,
        ...super.getSnapshot(),
      };
    }

    protected ensureData(useSnapshot: boolean) {
      super.ensureData(useSnapshot);
      this.goals = useSnapshot && yyw.USER.arena.level.goals || {};
      this.tfdLevel.text = `${this.currentLevel.level}`;

      // TODO 提示目标
      // TODO 显示目标
      // if (yyw.USER.guided) {
        // yyw.showModal(
        //   [
        //     `${this.limit.steps} 步内`,
        //     ...strArr,
        //   ].join("，"),
        //   false,
        // );
      // }

    }

    protected getGameData() {
      return {
        ...super.getGameData(),
      };
    }

    protected async collectCell(cell: Cell, num: number = 0) {
      const key = `${cell.getNumber()}`;
      if (this.currentLevel.goals.hasOwnProperty(key)) {
        const times = this.goals[key] || 0;
        this.goals[key] = times + 1;
        // TODO 显示目标完成情况
        if (this.isGoalsSatisfied()) {
          yyw.emit("LEVEL_WON");
        }
      }
      await super.collectCell(cell, num);
    }

    private isGoalsSatisfied(): boolean {
      const { goals } = this;
      return Object.entries(this.currentLevel.goals)
      .every(([ num, count ]: [ string, number ]) => {
        return goals[num] && goals[num] >= count;
      });
    }
  }
}
