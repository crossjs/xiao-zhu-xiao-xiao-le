var game;
(function (game) {
    class GoodSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/good.m4a`;
        }
    }
    game.GoodSound = GoodSound;
})(game || (game = {}));
