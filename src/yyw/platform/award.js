var yyw;
(function (yyw) {
    yyw.award = {
        async save({ coins = 0, points = 0, }) {
            if (coins) {
                return yyw.cloud.call("saveAward", { coins, points });
            }
            return {};
        },
    };
})(yyw || (yyw = {}));
