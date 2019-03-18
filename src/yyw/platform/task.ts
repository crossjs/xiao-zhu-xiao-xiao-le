namespace yyw {
  const TASK_KEY = "TASK";

  let tasks: any[];
  let myTasks: number[];

  async function getMyTasks() {
    if (!myTasks) {
      myTasks = await yyw.db.get(TASK_KEY) || [];
    }
    return myTasks;
  }

  export const task = {
    async get(): Promise<any[]> {
      if (!tasks) {
        const _myTasks = await getMyTasks();
        tasks = await cloud.read("tasks.json") || [];
        tasks.forEach((task: any, index: number) => {
          task.fulfilled = _myTasks.indexOf(index) !== -1;
        });
      }
      return tasks;
    },

    async save(index: number): Promise<void> {
      const { now, end } = getNowEnd("day");
      const expiresIn = end - now;
      const _myTasks = await getMyTasks();
      yyw.db.set(TASK_KEY, _myTasks.concat(index), expiresIn);
    },
  };
}
