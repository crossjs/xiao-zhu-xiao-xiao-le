var game;
(function (game) {
    class CtrlGroup1 extends yyw.Base {
        constructor() {
            super(...arguments);
            this.taskSofar = 0;
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.on("ARENA_RUN", ({ data: running }) => {
                    this.enabled = !running;
                });
                yyw.onTap(this.btnHome, () => {
                    yyw.director.toScene("landing");
                });
                this.btnTask.visible = true;
                yyw.onTap(this.btnTask, () => {
                    yyw.director.toScene("task", true);
                });
                yyw.on("TASK_DONE", () => {
                    this.updateTasks(1);
                });
                this.updateTasks();
            }
        }
        async updateTasks(mutation) {
            if (mutation) {
                this.taskSofar += mutation;
            }
            else {
                try {
                    const tasks = await yyw.task.get();
                    this.taskSofar = tasks.filter(({ fulfilled }) => fulfilled).length;
                }
                catch (error) {
                    egret.error(error);
                }
            }
            this.tfdTask.text = `${this.taskSofar}/6`;
        }
    }
    game.CtrlGroup1 = CtrlGroup1;
})(game || (game = {}));
