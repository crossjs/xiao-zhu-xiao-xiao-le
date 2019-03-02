var yyw;
(function (yyw) {
    function getNowDayEnd() {
        var now = new Date();
        var day = now.getDay() || 7;
        var end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - day, 23, 59, 59);
        return { now: now, day: day, end: end };
    }
    yyw.getNowDayEnd = getNowDayEnd;
})(yyw || (yyw = {}));
