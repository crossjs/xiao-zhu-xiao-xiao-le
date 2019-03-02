var game;
(function (game) {
    class Words extends yyw.Base {
        constructor() {
            super(...arguments);
            this.combo = -1;
            this.threshold = 2;
            this.words = ["good", "great", "amazing", "excellent"];
            this.sounds = [
                game.GoodSound,
                game.GreatSound,
                game.AmazingSound,
                game.ExcellentSound,
            ];
        }
        destroy() {
            this.hide();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.on("GAME_DATA", ({ data: { combo } }) => {
                    this.update(combo);
                }, this);
            }
        }
        update(combo) {
            if (combo === this.combo) {
                return;
            }
            if (combo > this.threshold) {
                this.show(Math.floor((combo - this.threshold) / this.threshold));
            }
            this.combo = combo;
        }
        async show(index) {
            await this.hide();
            index = Math.min(3, index);
            this.sounds[index].play();
            this.imgWords.source = `sprites2_json.${this.words[index]}`;
            await yyw.zoomIn(this.main, 300, egret.Ease.elasticOut);
            egret.setTimeout(this.hide, this, 500);
        }
        async hide() {
            await yyw.zoomOut(this.main);
        }
    }
    game.Words = Words;
})(game || (game = {}));
