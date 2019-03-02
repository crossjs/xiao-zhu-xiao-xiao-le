var game;
(function (game) {
    class ClickSound extends yyw.Sound {
        constructor() {
            super(...arguments);
            this.url = `${yyw.CONFIG.serverOrigin}/file/click.m4a`;
        }
    }
    game.ClickSound = ClickSound;
    yyw.setClick(() => {
        ClickSound.play();
    });
})(game || (game = {}));
