namespace game {
  export class CtrlGroup1 extends yyw.Base {
    private btnHome: eui.Button;
    private btnTask: eui.Button;
    private tfdTask: eui.BitmapLabel;
    private taskSofar: number = 0;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.on("RUN_CHANGE", ({ data: running }: egret.Event) => {
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

    private async updateTasks(mutation?: number) {
      if (mutation) {
        this.taskSofar += mutation;
      } else {
        try {
          const tasks = await yyw.task.get();
          this.taskSofar = tasks.filter(({ fulfilled }) => fulfilled).length;
        } catch (error) {
          egret.error(error);
        }
      }
      this.tfdTask.text = `${this.taskSofar}/6`;
    }
  }
}
