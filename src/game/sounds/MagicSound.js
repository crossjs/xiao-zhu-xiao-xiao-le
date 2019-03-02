var game;
(function (game) {
    class MagicSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/magic.m4a`;
        }
    }
    game.MagicSound = MagicSound;
})(game || (game = {}));
