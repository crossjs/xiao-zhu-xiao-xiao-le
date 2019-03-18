class Main extends eui.UILayer {
  private created: boolean = false;
  private loadingView: Loading;

  // debug 模式，使用图形绘制
  // private isDebug: boolean = true;

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
      yyw.analysis.addEvent("0准备就绪");
      this.runGame();
    } catch (error) {
      yyw.analysis.addEvent("0错误发生");
      egret.error(error);
      this.runGame();
    }
  }

  private async runGame() {
    if (await yyw.checkUpdate()) {
      if (await yyw.applyUpdate()) {
        return;
      }
    }
    let loaded: boolean = false;
    egret.setTimeout(
      () => {
        if (!loaded) {
          yyw.analysis.addEvent("6加载超时");
          this.createGameScene();
        }
      },
      null,
      10000,
    );
    yyw.analysis.addEvent("1开始加载");
    await this.loadResource();
    await this.loadGameConfig();
    loaded = true;
    yyw.analysis.addEvent("6完成加载");
    await this.createGameScene();
  }

  private async loadResource() {
    yyw.analysis.addEvent("2加载资源");
    try {
      await RES.loadConfig("resource/default.res.json", "resource/");
      await this.loadTheme();

      await RES.loadGroup("loading", 0);

      this.loadingView = new Loading({
        加载素材资源: 0,
        加载游戏配置: 0.5,
        加载用户信息: 0.6,
        加载每日任务: 0.8,
      });
      this.stage.addChild(this.loadingView);
      await RES.loadGroup("preload", 0, {
        onProgress: (current, total) => {
          this.loadingView.setProgress("加载素材资源", current, total);
        },
      });
    } catch (error) {
      egret.error(error);
    }
    yyw.analysis.addEvent("3完成资源加载");
  }

  private async loadGameConfig() {
    yyw.analysis.addEvent("4加载配置");
    // 可能网络请求失败，比如断网
    try {
      // 初始化全局配置
      this.loadingView.setProgress("加载游戏配置", 0.2, 1);
      await yyw.initConfig();
      this.loadingView.setProgress("加载游戏配置", 1, 1);

      // 先自动登录
      this.loadingView.setProgress("加载用户信息", 0.2, 1);
      await yyw.getLogin();
      this.loadingView.setProgress("加载用户信息", 1, 1);

      // 获取每日任务
      this.loadingView.setProgress("加载每日任务", 0.2, 1);
      await yyw.task.get();
      this.loadingView.setProgress("加载每日任务", 1, 1);
    } catch (error) {
      egret.error(error);
    }
    yyw.analysis.addEvent("5完成配置加载");
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

    yyw.director.setStage(this);

    // 初始化场景
    this.initScenes();

    yyw.analysis.addEvent("7进入主页");

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

    // 渠道统计
    yyw.trace();

    // 加个物理引擎玩一玩
    // this.createP2Scene();

    this.initAnalysis();
  }

  private initScenes() {
    yyw.director.init({
      award: new game.Award(),
      guide: new game.Guide(),
      landing: new game.Landing(),
      pass: new game.Pass(),
      playing: new game.Playing(),
      ranking: new game.Ranking(),
      shop: new game.Shop(),
      task: new game.Task(),
    });
  }

  private initAnalysis() {
    // 获得道具
    yyw.on("TOOL_GOT", ({ data: { type, amount } }) => {
      yyw.analysis.onRunning("award", type, amount);
    });

    // 使用道具
    yyw.on("TOOL_USED", ({ data: { type, amount } }) => {
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

  private async initSounds() {
    const fileIDs = [
      "alarm.m4a",
      "amazing.m4a",
      "bomb.m4a",
      "click.m4a",
      "coins.m4a",
      "excellent.m4a",
      "good.m4a",
      "great.m4a",
      "heal.m4a",
      "magic.m4a",
      "oops.m4a",
      "point.m4a",
      "swap.m4a",
    ];
    const fileURLs = await yyw.cloud.getTempFileURL(fileIDs);

    fileURLs.forEach((fileURL: string, index: number) => {
      const Name = yyw.ucFirst(fileIDs[index].replace(/\.m4a$/, ""));
      const SoundClass: typeof yyw.Sound = game[`${Name}Sound`];
      if (SoundClass) {
        // tslint:disable
        new SoundClass(fileURL);
        // tslint:enable
      }
    });
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
