var game;
(function (game) {
    class AmazingSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/amazing.m4a`;
        }
    }
    game.AmazingSound = AmazingSound;
})(game || (game = {}));
