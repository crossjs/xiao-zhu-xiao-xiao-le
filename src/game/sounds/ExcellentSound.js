var game;
(function (game) {
    class ExcellentSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/excellent.m4a`;
        }
    }
    game.ExcellentSound = ExcellentSound;
})(game || (game = {}));
