namespace game {
  interface InsGoals {
    [num: string]: Goal;
  }

  export class ArenaLevel extends ArenaBase {
    protected mode: string = "level";
    private tfdLevel: eui.BitmapLabel;
    private grpGoals: eui.Group;
    private insGoals: InsGoals = {};
    // 毫秒数
    private startTime: number = 0;

    public getSnapshot() {
      return {
        goals: yyw.eachChild(this.grpGoals, (goal: Goal) => goal.getAmount()),
        duration: Date.now() - this.startTime,
        ...super.getSnapshot(),
      };
    }

    protected ensureData(useSnapshot: boolean) {
      super.ensureData(useSnapshot);
      const numGoals = useSnapshot && yyw.USER.arena.level.goals || {};
      const duration = useSnapshot && yyw.USER.arena.level.duration || 0;
      this.startTime = Date.now() - duration;
      this.tfdLevel.text = `${this.currentLevel.level}`;

      // 清除
      yyw.removeChildren(this.grpGoals);

      this.insGoals = {};

      // 重建
      Object.entries(this.currentLevel.goals)
      .forEach(([ num, amount ]: [ string, number ], index: number) => {
        const key = `${index}`;
        // 创建 Goal 实例
        const goal = new Goal(num, numGoals[key] || amount);
        this.grpGoals.addChild(goal);
        this.insGoals[num] = goal;
      });
    }

    protected async collectCell(cell: Cell, num: number = 0) {
      const key = `${cell.getNumber()}`;
      await super.collectCell(cell, num);
      if (this.insGoals.hasOwnProperty(key)) {
        const goal = this.insGoals[key];
        await this.flyCellToGoal(cell, goal, key);
        goal.increaseAmount(1);
        this.checkGoals();
      }
    }

    private async flyCellToGoal(cell: Cell, goal: Goal, num: string) {
      const { x, y } = cell.localToGlobal();
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

    private checkGoals() {
      const satisfied = Object.values(this.insGoals)
      .every((goal: Goal) => goal.isCompleted());
      if (satisfied) {
        yyw.emit("LEVEL_PASS");
      }
    }
  }
}
