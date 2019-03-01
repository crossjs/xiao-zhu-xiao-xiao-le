namespace game {
  export class Task extends yyw.Base {
    private magicCount: number = 0;
    private gamesCount: number = 0;
    private scoreReach: number = 0;
    private tasks: any[] = [];

    protected async initialize(): Promise<void> {
      yyw.on("MAGIC_GOT", () => {
        this.magicCount++;
        this.checkTasks();
      });

      yyw.on("GAME_OVER", ({ data: {
        score,
      } }: egret.Event) => {
        this.gamesCount++;
        this.scoreReach = Math.max(this.scoreReach, score);
        this.checkTasks();
      });

      this.tasks = await yyw.task.get();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        this.tasks.forEach((task: any) => {
          const item: TaskItem = this[`task${task.order}`];
          item.setData(task);
        });
      }

      yyw.analysis.addEvent("7进入场景", { s: "每日任务" });
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
