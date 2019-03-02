var game;
(function (game) {
    class Task extends yyw.Base {
        constructor() {
            super(...arguments);
            this.magicCount = 0;
            this.gamesCount = 0;
            this.scoreReach = 0;
            this.tasks = [];
        }
        async initialize() {
            yyw.on("MAGIC_GOT", () => {
                this.magicCount++;
                this.checkTasks();
            });
            yyw.on("GAME_OVER", ({ data: { score, } }) => {
                this.gamesCount++;
                this.scoreReach = Math.max(this.scoreReach, score);
                this.checkTasks();
            });
            this.tasks = await yyw.task.get();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                this.tasks.forEach((task) => {
                    const item = this[`task${task.order}`];
                    item.setData(task);
                });
            }
            yyw.analysis.addEvent("7进入场景", { s: "每日任务" });
        }
        checkTasks() {
            this.tasks.filter(({ fulfilled }) => !fulfilled)
                .forEach(async (task) => {
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
                    const item = this[`task${task.order}`];
                    if (item) {
                        item.setData(task);
                    }
                    await yyw.task.save(_id);
                }
            });
        }
    }
    game.Task = Task;
})(game || (game = {}));
