namespace game {
  interface InsGoals {
    [num: string]: Goal;
  }

  export class ArenaLevel extends ArenaBase {
    protected mode: string = "level";
    private tfdLevel: eui.BitmapLabel;
    private grpGoals: eui.Group;
    private insGoals: InsGoals = {};

    public getSnapshot() {
      return {
        goals: yyw.eachChild(this.grpGoals, (goal: Goal) => goal.getAmount()),
        ...super.getSnapshot(),
      };
    }

    protected ensureData(useSnapshot: boolean) {
      super.ensureData(useSnapshot);
      const goals = useSnapshot && yyw.USER.arena.level.goals || [];

      this.tfdLevel.text = `${this.currentLevel.level}`;

      // 清除
      yyw.removeChildren(this.grpGoals);

      this.insGoals = {};

      // 重建
      Object.entries(this.currentLevel.goals)
      .forEach(([ num, amount ]: [ string, number ], index: number) => {
        const goal = this.insGoals[num] = new Goal(num, goals[index] || amount);
        this.grpGoals.addChild(goal);
      });
    }

    protected getGameData() {
      return {
        ...super.getGameData(),
      };
    }

    protected async collectCell(cell: Cell, num: number = 0) {
      const key = `${cell.getNumber()}`;
      await super.collectCell(cell, num);
      if (this.insGoals.hasOwnProperty(key)) {
        const goal = this.insGoals[key];
        await this.fly(cell, goal, key);
        goal.increaseAmount(1);
        this.check();
      }
    }

    private async fly(cell: Cell, goal: Goal, num: string) {
      const { x, y } = cell.localToGlobal();
      // const top = this.stage.stageHeight - 1012;
      const dup = new eui.Image(`fruits_json.${num}`);
      dup.x = x;
      dup.y = y;
      this.stage.addChild(dup);

      yyw.bezierTo(dup, goal.localToGlobal(), 500);

      await yyw.getTween(dup).to({
        alpha: 0.5,
      }, 500);

      yyw.removeElement(dup);
    }

    private check() {
      const satisfied = yyw.eachChild(this.grpGoals, (goal: Goal) => {
        return goal.isComplete();
      }).every((completed: boolean) => completed);
      if (satisfied) {
        yyw.emit("LEVEL_WON");
      }
    }
  }
}
