var game;
(function (game) {
    const SNAPSHOT_KEY = "YYW_G4_TOOLS";
    class Tools extends yyw.Base {
        constructor() {
            super(...arguments);
            this.valueUp = yyw.CONFIG.toolAmount;
            this.shuffle = yyw.CONFIG.toolAmount;
            this.breaker = yyw.CONFIG.toolAmount;
            this.livesUp = yyw.CONFIG.toolAmount;
        }
        set targetRect(targetRect) {
            this.tools.forEach((tool) => {
                tool.targetRect = targetRect;
            });
        }
        async startTool(useSnapshot) {
            if (useSnapshot) {
                const snapshot = await yyw.storage.get(SNAPSHOT_KEY);
                if (snapshot) {
                    Object.assign(this, snapshot);
                }
            }
            this.tools.forEach((tool) => {
                tool.setAmount(this[tool.type]);
            });
        }
        destroy() {
            this.tools.forEach((tool) => {
                this[tool.type] = tool.getAmount();
            });
            yyw.storage.set(SNAPSHOT_KEY, {
                valueUp: this.valueUp,
                shuffle: this.shuffle,
                breaker: this.breaker,
                livesUp: this.livesUp,
            });
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                this.tools = [
                    this.toolValueUp,
                    this.toolShuffle,
                    this.toolBreaker,
                    this.toolLivesUp,
                ];
                yyw.on("ARENA_RUN", ({ data: running }) => {
                    this.enabled = !running;
                });
                yyw.on("RANDOM_TOOL", () => {
                    yyw.randomChild(this.main).increaseAmount(1);
                });
            }
        }
    }
    game.Tools = Tools;
})(game || (game = {}));
