var yyw;
(function (yyw) {
    yyw.pbl = {
        async all() {
            return yyw.cloud.call("getPbl");
        },
        async me() {
            return yyw.cloud.call("getMyPbl");
        },
        async save({ score, level, combo, }) {
            if (score) {
                yyw.sub.postMessage({
                    command: "saveScore",
                    score,
                });
            }
            return yyw.cloud.call("saveMyPbl", { score, level, combo });
        },
    };
})(yyw || (yyw = {}));
