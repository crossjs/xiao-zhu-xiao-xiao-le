var yyw;
(function (yyw) {
    const TASK_KEY = "TASK";
    async function getMyTasks() {
        return await yyw.db.get(TASK_KEY) || [];
    }
    yyw.task = {
        async get() {
            const myTasks = await getMyTasks();
            const tasks = await yyw.cloud.call("getTasks");
            tasks.forEach((task) => {
                task.fulfilled = myTasks.indexOf(task._id) !== -1;
            });
            return tasks;
        },
        async save(id) {
            const myTasks = await getMyTasks();
            const { now, end } = yyw.getNowDayEnd();
            const expiresIn = end.getTime() - now.getTime();
            yyw.db.set(TASK_KEY, myTasks.concat(id), expiresIn);
        },
    };
})(yyw || (yyw = {}));
