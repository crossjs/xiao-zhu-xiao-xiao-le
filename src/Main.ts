class Main extends eui.UILayer {
  private created: boolean = false;
  private loadingView: LoadingUI;

  protected createChildren(): void {
    super.createChildren();

    // egret.lifecycle.addLifecycleListener((context) => {
    //   // custom lifecycle plugin
    // });

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
    } catch (error) {
      egret.error(error);
    }
  }

  private async runGame() {
    let loaded: boolean = false;
    egret.setTimeout(() => {
      if (!loaded) {
        egret.error("加载超时，强制进入");
        yyw.removeElement(this.loadingView);
        this.createGameScene();
      }
    }, null, 10000);
    await this.loadResource();
    loaded = true;
    await this.createGameScene();
  }

  private async loadResource() {
    try {
      await RES.loadConfig("resource/default.res.json", "resource/");
      await this.loadTheme();

      await RES.loadGroup("loading", 0);

      this.loadingView = new LoadingUI();
      this.stage.addChild(this.loadingView);
      await RES.loadGroup("preload", 0, this.loadingView);
      yyw.removeElement(this.loadingView);
    } catch (error) {
      egret.error(error);
    }
  }

  private loadTheme(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 加载皮肤主题配置文件。
      const theme = new eui.Theme("resource/default.thm.json", this.stage);
      theme.once(eui.UIEvent.COMPLETE, resolve, this);
    });
  }

  /**
   * 创建场景界面
   */
  private async createGameScene(): Promise<void> {
    if (this.created) {
      return;
    }

    this.created = true;

    // 可能网络请求失败，比如断网
    try {
      // 初始化全局配置
      await yyw.initConfig();

      // 先自动登录
      await yyw.getAccessToken();
    } catch (error) {
      egret.error(error);
    }

    yyw.director.setStage(this);

    // 初始化场景
    this.initScenes();

    // 跳转到着陆页
    yyw.director.toScene("landing");

    // 初始化音频
    this.initSounds();

    // 初始化转发参数
    yyw.initShare();

    // 初始化视频广告
    yyw.initVideoAd();

    // 初始化子域资源
    yyw.sub.postMessage({
      command: "initRanking",
    });
  }

  private initScenes() {
    yyw.director.init({
      landing: new game.Landing(),
      pbl: new game.Pbl(),
      playing: new game.Playing(),
      guide: new game.Guide(),
      ranking: new game.Ranking(),
      checkin: new game.Checkin(),
      ending: new game.Ending(),
      shop: new game.Shop(),
      alarm: new game.Alarm(),
      award: new game.Award(),
      words: new game.Words(),
    });

    // 启用道具奖励
    if (yyw.CONFIG.toolReward) {
      // 体力过低
      yyw.on("LIVES_LEAST", () => {
        yyw.director.toScene("alarm", true);
      });
    }

    // 体力耗尽
    yyw.on("LIVES_EMPTY", () => {
      yyw.director.toScene("ending", true);
    });

    // 启用金币奖励
    if (yyw.CONFIG.coinReward) {
      // 获得魔法数字
      yyw.on("ARENA_MAGIC_NUMBER_GOT", () => {
        yyw.director.toScene("award", true);
      });
    }

    // 游戏结束
    yyw.on("GAME_OVER", () => {
      yyw.director.toScene("playing", false, (scene: game.Playing) => {
        scene.startGame();
      });
    });
  }

  private initSounds() {
    // tslint:disable
    new game.AmazingSound();
    new game.ClickSound();
    new game.CoinsSound();
    new game.ExcellentSound();
    new game.GoodSound();
    new game.GreatSound();
    new game.MagicSound();
    new game.PointSound();
    new game.SwapSound();
    // tslint:enable
  }
}
