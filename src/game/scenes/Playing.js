var game;
(function (game) {
    const SNAPSHOT_KEY = "YYW_G4_PLAYING";
    class Playing extends yyw.Base {
        constructor() {
            super(...arguments);
            this.isGameOver = false;
            this.maxCombo = 0;
        }
        async exiting() {
        }
        initialize() {
            yyw.on("RESTART", () => {
                this.startGame();
            });
        }
        destroy() {
            this.setSnapshot(this.isGameOver ? null : undefined);
            this.removeClosest();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            let snapshot;
            let useSnapshot;
            if (!this.isGameOver) {
                snapshot = await this.getSnapshot();
                if (snapshot) {
                    useSnapshot = await yyw.showModal("继续上一次的进度？");
                }
            }
            this.createClosest();
            await this.arena.startGame(useSnapshot);
            await this.tools.startTool(useSnapshot);
            this.isGameOver = false;
            if (fromChildrenCreated) {
                yyw.director.toScene(yyw.USER.score ? "task" : "guide", true);
                yyw.on("GAME_OVER", this.onGameOver, this);
                this.initToolsTarget();
                if (this.stage.stageHeight <= 1334) {
                    this.ctrlGroup3.y = 108;
                    this.ctrlGroup3.scale = 0.75;
                }
                this.ctrlGroup3.visible = true;
                if (yyw.CONFIG.shopStatus) {
                    this.ctrlShop.visible = true;
                }
                if (!await yyw.showBannerAd()) {
                    this.boxAll = new box.All();
                    this.boxAll.bottom = 0;
                    this.addChild(this.boxAll);
                }
            }
            yyw.analysis.addEvent("7进入场景", { s: "游戏界面" });
        }
        startGame() {
            this.arena.startGame();
            this.createClosest();
        }
        async getSnapshot() {
            return yyw.storage.get(SNAPSHOT_KEY);
        }
        setSnapshot(value) {
            if (value === null) {
                yyw.storage.set(SNAPSHOT_KEY, null);
            }
            else {
                const { maxCombo } = this;
                yyw.storage.set(SNAPSHOT_KEY, {
                    maxCombo,
                });
            }
        }
        createClosest() {
            this.closest = new game.Closest();
            this.closest.x = 15;
            this.closest.y = 132;
            this.body.addChild(this.closest);
        }
        removeClosest() {
            yyw.removeElement(this.closest);
            this.closest = null;
        }
        async onGameData({ data: { combo, } }) {
            this.maxCombo = Math.max(combo, this.maxCombo);
        }
        onGameOver({ data: { level, combo, score, } }) {
            this.isGameOver = true;
            this.setSnapshot(null);
            yyw.pbl.save({
                score,
                level,
                combo: Math.max(combo, this.maxCombo),
            });
        }
        initToolsTarget() {
            const { x, y, width, height } = this.arena;
            const padding = 15;
            const rect = new egret.Rectangle(x + padding, y + padding + this.stage.stageHeight - 1334, width - padding * 2, height - padding * 2);
            this.tools.targetRect = rect;
        }
    }
    game.Playing = Playing;
})(game || (game = {}));
