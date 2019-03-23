namespace game {
  export class Task extends yyw.Base {
    private grpItems: eui.Group;
    private levelsCount: number = 0;
    private scoreReach: number = 0;
    private tasks: any[] = [];

    protected async initialize(): Promise<void> {
      // 完成关卡
      yyw.on("LEVEL_PASS", () => {
        this.levelsCount++;
        this.checkTasks();
      });

      // 获得分数
      yyw.on("SNAPSHOT", ({ data: { score } }: egret.Event) => {
        if (yyw.LevelSys.mode === "score") {
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
        this.tasks.forEach((task: any, index: number) => {
          const item: TaskItem = this[`task${index}`];
          item.setData(task);
        });
        this.grpItems.visible = true;
      }

      yyw.analysis.addEvent("9进入每日任务");
    }

    private checkTasks() {
      this.tasks.forEach(async (task: any, index: number) => {
        const { fulfilled, action, total, coins } = task;
        if (!fulfilled) {
          const ok1 = action === "level" && this.levelsCount >= total;
          const ok2 = action === "score" && this.scoreReach >= total;

          if (ok1 || ok2) {
            yyw.emit("TASK_DONE");
            yyw.emit("COINS_GOT", {
              type: "task",
              amount: coins,
            });
            task.fulfilled = true;
            const item: TaskItem = this[`task${index}`];
            // 可能还没初始化
            if (item) {
              item.setData(task);
            }
            await yyw.task.save(index);
          }
        }
      });
    }
  }
}
