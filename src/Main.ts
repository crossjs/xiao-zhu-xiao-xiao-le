class Main extends eui.UILayer {
  private created: boolean = false;

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

      const loadingView = new LoadingUI();
      this.stage.addChild(loadingView);
      await RES.loadGroup("preload", 0, loadingView);
      yyw.removeElement(loadingView);
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

    // 初始化全局配置
    await yyw.initConfig();

    game.SceneManager.setStage(this);
    game.SceneManager.toScene("landing");

    // 初始化转发参数
    yyw.initShare();
    // 初始化视频广告
    yyw.initVideoAd();
    // 初始化子域资源
    yyw.sub.postMessage({
      command: "initRanking",
    });
  }
}
