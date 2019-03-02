var game;
(function (game) {
    class PointSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/point.m4a`;
        }
    }
    game.PointSound = PointSound;
})(game || (game = {}));
