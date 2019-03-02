var game;
(function (game) {
    class SwapSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/swap.m4a`;
        }
    }
    game.SwapSound = SwapSound;
})(game || (game = {}));
