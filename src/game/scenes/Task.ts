namespace game {
  export class Task extends yyw.Base {
    private grpItems: eui.Group;
    private magicCount: number = 0;
    private gamesCount: number = 0;
    private scoreReach: number = 0;
    private tasks: any[] = [];

    protected async initialize(): Promise<void> {
      // 完成关卡
      yyw.on("LEVEL_WON", () => {
        this.gamesCount++;
        this.checkTasks();
      });

      // 获得分数
      yyw.on("GAME_DATA", ({ data: { score } }: egret.Event) => {
        if (yyw.CONFIG.mode === "score") {
          if (score > this.scoreReach) {
            this.scoreReach = score;
            this.checkTasks();
          }
        }
      });
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.showToast("加载中……");
        this.tasks = await yyw.task.get() || [];
        yyw.hideToast();
        this.tasks.forEach((task: any) => {
          const item: TaskItem = this[`task${task.order}`];
          item.setData(task);
        });
        this.grpItems.visible = true;
      }

      yyw.analysis.addEvent("9进入每日任务");
    }

    private checkTasks() {
      this.tasks.filter(({ fulfilled }) => !fulfilled)
      .forEach(async (task: any) => {
        const { _id, action, total, coins } = task;
        const ok1 = action === "games" && this.gamesCount >= total;
        const ok2 = action === "score" && this.scoreReach >= total;
        const ok3 = action === "magic" && this.magicCount >= total;

        if (ok1 || ok2 || ok3) {
          yyw.emit("TASK_DONE");
          yyw.emit("COINS_GOT", {
            type: "task",
            amount: coins,
          });
          task.fulfilled = true;
          const item: TaskItem = this[`task${task.order}`];
          // 可能还没初始化
          if (item) {
            item.setData(task);
          }
          await yyw.task.save(_id);
        }
      });
    }
  }
}
