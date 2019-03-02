var game;
(function (game) {
    class Shop extends yyw.Base {
        constructor() {
            super(...arguments);
            this.prices = [1000, 2000, 1500];
            this.goods = ["valueUp", "shuffle", "breaker"];
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                for (let i = 0; i < this.goods.length; i++) {
                    ((index) => {
                        yyw.onTap(this[`btn${index}`], async () => {
                            const type = this.goods[index];
                            const coins = this.prices[index];
                            await yyw.award.save({
                                coins: -coins,
                            });
                            yyw.emit("COINS_USED", {
                                type,
                                amount: coins,
                            });
                            yyw.showToast("兑换成功");
                            yyw.emit("TOOL_GOT", {
                                type,
                                amount: 1,
                            });
                            await this.update();
                        });
                    })(i);
                }
            }
            await this.update();
            yyw.analysis.addEvent("7进入场景", { s: "道具兑换" });
        }
        async update() {
            try {
                const { coins } = await yyw.pbl.me();
                for (let i = 0; i < this.goods.length; i++) {
                    const enabled = coins >= this.prices[i];
                    const btn = this[`btn${i}`];
                    const grp = this[`grp${i}`];
                    btn.enabled = enabled;
                    if (enabled) {
                        grp.filters = null;
                    }
                    else {
                        yyw.gray(grp);
                    }
                }
            }
            catch (error) {
                egret.error(error);
            }
        }
    }
    game.Shop = Shop;
})(game || (game = {}));
