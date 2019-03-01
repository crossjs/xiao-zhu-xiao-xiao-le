namespace yyw {
  const TASK_KEY = "TASK";

  async function getMyTasks() {
    return await yyw.db.get(TASK_KEY) || [];
  }

  export const task = {
    async get(): Promise<any> {
      const myTasks = await getMyTasks();
      const tasks = await cloud.call("getTasks");
      tasks.forEach((task: any) => {
        task.fulfilled = myTasks.indexOf(task._id) !== -1;
      });
      return tasks;
    },

    async save(id: string): Promise<any> {
      const myTasks = await getMyTasks();
      const { now, end } = getNowDayEnd();
      const expiresIn = end.getTime() - now.getTime();
      yyw.db.set(TASK_KEY, myTasks.concat(id), expiresIn);
    },
  };
}
