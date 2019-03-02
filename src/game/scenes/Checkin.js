var game;
(function (game) {
    const STORAGE_KEY = "CHECKIN";
    const bonus = [[100], [150], [200], [250, "breaker"], [300], [350], [400, "shuffle"]];
    class Checkin extends yyw.Base {
        destroy() {
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                const days = await yyw.checkin.get();
                yyw.eachChild(this.groupDays, (child, index) => {
                    const day = days[index];
                    if (day.offset > 0) {
                        child.alpha = 0.5;
                    }
                    else if (day.checked) {
                        child.getChildAt(child.numChildren - 1).visible = true;
                    }
                    else {
                        const isPast = day.offset < 0;
                        if (isPast) {
                            child.alpha = 0.75;
                        }
                        if (!isPast || yyw.reward.can()) {
                            const offTap = yyw.onTap(child, async () => {
                                if (isPast) {
                                    if (!await yyw.reward.apply("checkin")) {
                                        return;
                                    }
                                }
                                offTap();
                                const [coins, type] = bonus[index];
                                await yyw.award.save({ coins });
                                yyw.emit("COINS_GOT", {
                                    type: "checkin",
                                    amount: coins,
                                });
                                if (type) {
                                    yyw.emit("TOOL_GOT", {
                                        type,
                                        amount: 1,
                                    });
                                }
                                yyw.checkin.save(index);
                                child.alpha = 1;
                                child.getChildAt(child.numChildren - 1).visible = true;
                                yyw.showToast(`${isPast ? "补签" : "签到"}成功，奖励已发放`);
                            });
                        }
                    }
                });
            }
            yyw.analysis.addEvent("7进入场景", { s: "每日签到" });
        }
    }
    game.Checkin = Checkin;
})(game || (game = {}));
