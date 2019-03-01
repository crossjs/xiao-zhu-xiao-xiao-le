class Main extends eui.UILayer {
  private created: boolean = false;
  private loadingView: LoadingUI;

  // debug 模式，使用图形绘制
  // private isDebug: boolean = true;

  /**
   * 埋点
   * 1、开始资源加载
   * 2、资源加载完成
   * 3、开始游戏（授权）
   * 4、进入游戏（确认授权）
   */

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
    if (await yyw.checkUpdate()) {
      if (await yyw.applyUpdate()) {
        return;
      }
    }
    let loaded: boolean = false;
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

  private async loadResource() {
    try {
      await RES.loadConfig("resource/default.res.json", "resource/");
      await this.loadTheme();

      await RES.loadGroup("loading", 0);

      this.loadingView = new LoadingUI();
      this.stage.addChild(this.loadingView);
      await RES.loadGroup("preload", 0, this.loadingView);
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

    yyw.analysis.addEvent("3加载配置");
    // 可能网络请求失败，比如断网
    try {
      // 初始化全局配置
      await yyw.initConfig();

      // 先自动登录
      await yyw.getLogin();
    } catch (error) {
      egret.error(error);
    }

    yyw.director.setStage(this);

    // 初始化场景
    this.initScenes();

    // 跳转到着陆页
    yyw.director.toScene("landing");

    // 移除加载界面
    yyw.removeElement(this.loadingView);

    // 初始化音频
    this.initSounds();

    // 初始化转发参数
    yyw.initShare();

    // 初始化子域资源
    yyw.sub.postMessage({
      command: "initRanking",
    });

    // 加个物理引擎玩一玩
    // this.createP2Scene();
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
      task: new game.Task(),
      shop: new game.Shop(),
      alarm: new game.Alarm(),
      award: new game.Award(),
      words: new game.Words(),
    });

    // 启用道具奖励
    if (yyw.reward.can("tool")) {
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
    if (yyw.reward.can("coin")) {
      // 获得魔法数字
      yyw.on("MAGIC_GOT", () => {
        yyw.analysis.onRunning("award", "magic");
        yyw.director.toScene("award", true);
      });
    }

    // 游戏开始
    yyw.on("GAME_START", () => {
      yyw.analysis.onStart();
    });

    // 游戏中止
    yyw.on("GAME_INTERRUPT", () => {
      yyw.analysis.onEnd("fail");
    });

    // 游戏复活
    yyw.on("GAME_REVIVED", ({ data: { type }}) => {
      yyw.analysis.onRunning("revive", type);
    });

    // 游戏结束
    yyw.on("GAME_OVER", () => {
      yyw.analysis.onEnd();
      yyw.director.toScene("playing", false, (scene: game.Playing) => {
        scene.startGame();
      });
    });

    // 获得道具
    yyw.on("TOOL_GOT", ({ data: { type, amount }}) => {
      yyw.analysis.onRunning("award", type, amount);
    });

    // 使用道具
    yyw.on("TOOL_USED", ({ data: { type, amount }}) => {
      yyw.analysis.onRunning("tools", type, amount);
    });

    // 获得金币
    yyw.on("COINS_GOT", ({ data: { amount } }) => {
      yyw.analysis.onRunning("award", "coins", amount);
    });

    // 使用金币
    yyw.on("COINS_USED", ({ data: { type } }) => {
      yyw.analysis.onRunning("paySuccess", type);
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

  /**
   * 创建游戏场景
   */
  // private createP2Scene(): void {
  //   // egret.Profiler.getInstance().run();
  //   const factor: number = 50;

  //   // 创建 world
  //   const world: p2.World = new p2.World();
  //   world.sleepMode = p2.World.BODY_SLEEPING;

  //   // 创建 plane
  //   const planeShape: p2.Plane = new p2.Plane();
  //   const planeBody: p2.Body = new p2.Body();
  //   planeBody.addShape(planeShape);
  //   planeBody.displays = [];
  //   world.addBody(planeBody);

  //   egret.Ticker.getInstance().register((dt: number) => {
  //     if (dt < 10) {
  //       return;
  //     }
  //     if (dt > 1000) {
  //       return;
  //     }
  //     world.step(dt / 1000);

  //     const stageHeight: number = egret.MainContext.instance.stage.stageHeight;
  //     const l = world.bodies.length;
  //     for (let i: number = 0; i < l; i++) {
  //       const boxBody: p2.Body = world.bodies[i];
  //       const box: egret.DisplayObject = boxBody.displays[0];
  //       if (box) {
  //         box.x = boxBody.position[0] * factor;
  //         box.y = stageHeight - boxBody.position[1] * factor;
  //         box.rotation =
  //           360 - ((boxBody.angle + boxBody.shapes[0].angle) * 180) / Math.PI;
  //         if (boxBody.sleepState === p2.Body.SLEEPING) {
  //           box.alpha = 0.5;
  //         } else {
  //           box.alpha = 1;
  //         }
  //       }
  //     }
  //   }, this);

  //   // 鼠标点击添加刚体
  //   this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent): void => {
  //     const positionX: number = Math.floor(e.stageX / factor);
  //     const positionY: number = Math.floor(
  //       (egret.MainContext.instance.stage.stageHeight - e.stageY) / factor,
  //     );
  //     let display: egret.DisplayObject;
  //     let boxBody: p2.Body;
  //     if (Math.random() > 0.5) {
  //       // 添加方形刚体
  //       // var boxShape: p2.Shape = new p2.Rectangle(2, 1);
  //       const boxShape: p2.Shape = new p2.Box({ width: 2, height: 1 });
  //       boxBody = new p2.Body({
  //         mass: 1,
  //         position: [positionX, positionY],
  //         angularVelocity: 1,
  //       });
  //       boxBody.addShape(boxShape);
  //       world.addBody(boxBody);

  //       if (this.isDebug) {
  //         display = this.createBox(
  //           (boxShape as p2.Box).width * factor,
  //           (boxShape as p2.Box).height * factor,
  //         );
  //       } else {
  //         display = this.createBitmapByName("rect");
  //       }
  //       display.width = (boxShape as p2.Box).width * factor;
  //       display.height = (boxShape as p2.Box).height * factor;
  //     } else {
  //       // 添加圆形刚体
  //       // var boxShape: p2.Shape = new p2.Circle(1);
  //       const boxShape: p2.Shape = new p2.Circle({ radius: 1 });
  //       boxBody = new p2.Body({
  //         mass: 1,
  //         position: [positionX, positionY],
  //       });
  //       boxBody.addShape(boxShape);
  //       world.addBody(boxBody);

  //       if (this.isDebug) {
  //         display = this.createBall((boxShape as p2.Circle).radius * factor);
  //       } else {
  //         display = this.createBitmapByName("circle");
  //       }

  //       display.width = (boxShape as p2.Circle).radius * 2 * factor;
  //       display.height = (boxShape as p2.Circle).radius * 2 * factor;
  //     }

  //     display.anchorOffsetX = display.width / 2;
  //     display.anchorOffsetY = display.height / 2;

  //     boxBody.displays = [display];
  //     this.addChild(display);
  //   }, this);
  // }

  /**
   * 根据 name 关键字创建一个 Bitmap 对象。
   * name 属性请参考 resources/resource.json 配置文件的内容。
   */
  // private createBitmapByName(name: string): egret.Bitmap {
  //   const result: egret.Bitmap = new egret.Bitmap();
  //   const texture: egret.Texture = RES.getRes(name);
  //   result.texture = texture;
  //   return result;
  // }

  /**
   * 创建一个圆形
   */
  // private createBall(r: number): egret.Shape {
  //   const shape = new egret.Shape();
  //   shape.graphics.beginFill(0xfff000);
  //   shape.graphics.drawCircle(r, r, r);
  //   shape.graphics.endFill();
  //   return shape;
  // }

  /**
   * 创建一个方形
   */
  // private createBox(width: number, height: number): egret.Shape {
  //   const shape = new egret.Shape();
  //   shape.graphics.beginFill(0xfff000);
  //   shape.graphics.drawRect(0, 0, width, height);
  //   shape.graphics.endFill();
  //   return shape;
  // }
}
