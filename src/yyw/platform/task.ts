namespace yyw {
  const TASK_KEY = "TASK";

  let tasks: any[];
  let myTasks: string[];

  async function getMyTasks() {
    if (!myTasks) {
      myTasks = await yyw.db.get(TASK_KEY) || [];
    }
    return myTasks;
  }

  export const task = {
    async get(): Promise<any> {
      if (!tasks) {
        const _myTasks = await getMyTasks();
        tasks = await cloud.call("getTasks") || [];
        tasks.forEach((task: any) => {
          task.fulfilled = _myTasks.indexOf(task._id) !== -1;
        });
      }
      return tasks;
    },

    async save(id: string): Promise<any> {
      const { now, end } = getNowEnd("day");
      const expiresIn = end - now;
      const _myTasks = await getMyTasks();
      yyw.db.set(TASK_KEY, _myTasks.concat(id), expiresIn);
    },
  };
}
