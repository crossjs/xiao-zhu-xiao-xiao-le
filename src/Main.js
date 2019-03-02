class Main extends eui.UILayer {
    constructor() {
        super(...arguments);
        this.created = false;
    }
    createChildren() {
        super.createChildren();
        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        };
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        try {
            this.runGame();
        }
        catch (error) {
            egret.error(error);
        }
    }
    async runGame() {
        if (await yyw.checkUpdate()) {
            if (await yyw.applyUpdate()) {
                return;
            }
        }
        let loaded = false;
        egret.setTimeout(() => {
            if (!loaded) {
                yyw.analysis.addEvent("2加载超时");
                this.createGameScene();
            }
        }, null, 10000);
        yyw.analysis.addEvent("1开始加载");
        await this.loadResource();
        loaded = true;
        yyw.analysis.addEvent("2加载完成");
        await this.createGameScene();
    }
    async loadResource() {
        try {
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("loading", 0);
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
            await RES.loadGroup("preload", 0, this.loadingView);
        }
        catch (error) {
            egret.error(error);
        }
    }
    loadTheme() {
        return new Promise((resolve, reject) => {
            const theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.once(eui.UIEvent.COMPLETE, resolve, this);
        });
    }
    async createGameScene() {
        if (this.created) {
            return;
        }
        this.created = true;
        yyw.analysis.addEvent("3加载配置");
        try {
            await yyw.initConfig();
            await yyw.getLogin();
        }
        catch (error) {
            egret.error(error);
        }
        yyw.director.setStage(this);
        this.initScenes();
        yyw.director.toScene("landing");
        yyw.removeElement(this.loadingView);
        this.initSounds();
        yyw.initShare();
        yyw.sub.postMessage({
            command: "initRanking",
        });
    }
    initScenes() {
        yyw.director.init({
            alarm: new game.Alarm(),
            award: new game.Award(),
            checkin: new game.Checkin(),
            ending: new game.Ending(),
            guide: new game.Guide(),
            landing: new game.Landing(),
            pbl: new game.Pbl(),
            playing: new game.Playing(),
            ranking: new game.Ranking(),
            reviving: new game.Reviving(),
            shop: new game.Shop(),
            task: new game.Task(),
            words: new game.Words(),
        });
        if (yyw.reward.can("tool")) {
            yyw.on("LIVES_LEAST", () => {
                yyw.director.toScene("alarm", true);
            });
        }
        const canRevive = yyw.reward.can("revive");
        yyw.on("LIVES_EMPTY", () => {
            yyw.director.toScene(canRevive ? "reviving" : "ending", true);
        });
        if (yyw.reward.can("coin")) {
            yyw.on("MAGIC_GOT", () => {
                yyw.director.toScene("award", true);
                yyw.analysis.onRunning("award", "magic");
            });
        }
        yyw.on("TOOL_GOT", ({ data: { type, amount } }) => {
            yyw.analysis.onRunning("award", type, amount);
        });
        yyw.on("TOOL_USED", ({ data: { type, amount } }) => {
            yyw.analysis.onRunning("tools", type, amount);
        });
        yyw.on("COINS_GOT", ({ data: { amount } }) => {
            yyw.analysis.onRunning("award", "coins", amount);
        });
        yyw.on("COINS_USED", ({ data: { type } }) => {
            yyw.analysis.onRunning("paySuccess", type);
        });
    }
    initSounds() {
        new game.AmazingSound();
        new game.ClickSound();
        new game.CoinsSound();
        new game.ExcellentSound();
        new game.GoodSound();
        new game.GreatSound();
        new game.MagicSound();
        new game.PointSound();
        new game.SwapSound();
    }
}
