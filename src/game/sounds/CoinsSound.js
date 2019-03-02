var game;
(function (game) {
    class CoinsSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/coins.m4a`;
        }
    }
    game.CoinsSound = CoinsSound;
})(game || (game = {}));
