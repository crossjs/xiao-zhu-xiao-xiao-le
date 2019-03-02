var game;
(function (game) {
    class Ending extends yyw.Base {
        constructor() {
            super(...arguments);
            this.gameData = {
                level: 0,
                combo: 0,
                score: 0,
            };
        }
        async initialize() {
            yyw.on("GAME_DATA", ({ data: { score, level, combo } }) => {
                this.gameData = {
                    score,
                    level,
                    combo: Math.max(combo, this.gameData.combo),
                };
            });
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.onTap(this.btnOK, async () => {
                    const { windowWidth, windowHeight } = yyw.CONFIG.systemInfo;
                    const { score, combo } = this.gameData;
                    const { width, height } = this.main;
                    const { x, y } = this.main.localToGlobal();
                    const scaleX = windowWidth / 375;
                    const scaleY = scaleX * windowHeight / 667;
                    yyw.share({
                        title: `噢耶！我得到了 ${score} 分与 ${combo} 次连击`,
                        imageUrl: canvas.toTempFilePathSync({
                            x,
                            y,
                            width: width * scaleX,
                            height: height * scaleY,
                            destWidth: 500,
                            destHeight: 400,
                        }),
                        ald_desc: "ending",
                    });
                });
                yyw.onTap(this.btnEscape, () => {
                    yyw.emit("RESTART");
                });
            }
            Object.entries(this.gameData).forEach(([key, value]) => {
                const field = this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`];
                if (field) {
                    field.text = `${value}`;
                }
            });
            yyw.emit("GAME_OVER", this.gameData);
            yyw.analysis.onEnd();
        }
    }
    game.Ending = Ending;
})(game || (game = {}));
