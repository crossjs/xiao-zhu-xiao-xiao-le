var game;
(function (game) {
    class GreatSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/great.m4a`;
        }
    }
    game.GreatSound = GreatSound;
})(game || (game = {}));
