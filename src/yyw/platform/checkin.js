var yyw;
(function (yyw) {
    const CHECKIN_KEY = "CHECKIN";
    async function getMyCheckins() {
        return await yyw.db.get(CHECKIN_KEY) || [];
    }
    yyw.checkin = {
        async get() {
            const myCheckins = await getMyCheckins();
            const { day } = yyw.getNowDayEnd();
            const days = [];
            for (let index = 0; index < 7; index++) {
                days[index] = {
                    offset: index + 1 - day,
                    checked: myCheckins.indexOf(index) !== -1,
                };
            }
            return days;
        },
        async save(index) {
            const { now, end } = yyw.getNowDayEnd();
            const expiresIn = end.getTime() - now.getTime();
            const myCheckins = await getMyCheckins();
            yyw.db.set(CHECKIN_KEY, myCheckins.concat(index), expiresIn);
        },
    };
})(yyw || (yyw = {}));
