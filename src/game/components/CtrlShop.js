var game;
(function (game) {
    class CtrlShop extends yyw.Base {
        constructor() {
            super(...arguments);
            this.coins = 0;
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.onTap(this.main, () => {
                    yyw.director.toScene("shop", true);
                });
                yyw.on("COINS_GOT", ({ data: { amount } }) => {
                    this.updateCoins(amount);
                });
                yyw.on("COINS_USED", ({ data: { amount } }) => {
                    this.updateCoins(-amount);
                });
                this.updateCoins();
            }
        }
        async updateCoins(mutation) {
            if (mutation) {
                this.coins += mutation;
            }
            else {
                try {
                    const { coins } = await yyw.pbl.me();
                    this.coins = coins;
                }
                catch (error) {
                    egret.error(error);
                }
            }
            this.tfdCoins.text = `${this.coins}`;
        }
    }
    game.CtrlShop = CtrlShop;
})(game || (game = {}));
