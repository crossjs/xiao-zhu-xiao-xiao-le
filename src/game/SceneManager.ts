namespace game {
  /**
   * 场景管理类
   */
  export class SceneManager {
    static get instance() {
      if (!this.sceneManager) {
        this.sceneManager = new SceneManager();
      }
      return this.sceneManager;
    }

    /**
     * 获取实例
     */
    public static sceneManager: SceneManager;

    public static setStage(stage: eui.UILayer): void {
      SceneManager.instance.setStage(stage);
    }

    public static getScene(name: string): yyw.Base {
      return SceneManager.instance.getScene(name);
    }

    public static async escape(): Promise<void> {
      const { theScene } = SceneManager.instance;
      await theScene.exiting();
      yyw.removeChild(theScene);
    }

    public static async toScene(
      name: string,
      keepOther: boolean = false,
      callback?: any,
    ): Promise<yyw.Base> {
      // (根) 舞台
      const stage: egret.DisplayObjectContainer = SceneManager.instance.theStage;
      const scene = SceneManager.getScene(name);

      // 判断场景是否有父级（如果有，说明已经被添加到了场景中）
      if (!scene.parent) {
        // 未被添加到场景，把场景添加到之前设置好的根舞台中
        stage.addChild(scene);
        SceneManager.instance.theScene = scene;
        if (keepOther) {
          // 创建 Tween 对象
          await scene.entering();
        }
      }

      if (callback) {
        // 回调
        callback(scene);
      }

      if (!keepOther) {
        SceneManager.instance.removeOthers(name);
      }

      yyw.setZIndex(scene);

      return scene;
    }

    private theStage: eui.UILayer; // 设置所有场景所在的舞台(根)
    private theScene: yyw.Base; // 当前场景

    private scenes: {
      landing: Landing;
      pbl: Pbl;
      playing: Playing;
      guide: Guide;
      ranking: Ranking;
      ending: Ending;
      shop: Shop;
      alarm: Alarm;
      award: Award;
      words: Words;
    } = {
      landing: new Landing(),
      pbl: new Pbl(),
      playing: new Playing(),
      guide: new Guide(),
      ranking: new Ranking(),
      ending: new Ending(),
      shop: new Shop(),
      alarm: new Alarm(),
      award: new Award(),
      words: new Words(),
    };

    constructor() {
      // 体力过低
      yyw.on("LIVES_LEAST", () => {
        SceneManager.toScene("alarm", true);
      });

      // 体力耗尽
      yyw.on("LIVES_EMPTY", () => {
        SceneManager.toScene("ending", true);
      });

      // 获得魔法数字
      yyw.on("ARENA_MAGIC_NUMBER_GOT", () => {
        SceneManager.toScene("award", true);
      });

      yyw.on("ARENA_MAGIC_NUMBER_GOT", () => {
        SceneManager.toScene("award", true);
      });

      // 游戏结束
      yyw.on("GAME_OVER", () => {
        SceneManager.toScene("landing");
      });
    }

    /**
     * 设置根场景
     */
    public setStage(stage: eui.UILayer) {
      this.theStage = stage;
    }

    /**
     * 获取指定场景
     */
    private getScene(name: string): yyw.Base {
      return this.scenes[name];
    }

    /**
     * 删除其他场景
     * @param name 不需要删除的场景的名字
     */
    private removeOthers(name: string) {
      Object.keys(this.scenes)
      .filter((key) => key !== name)
      .forEach((key) => {
        yyw.removeChild(this.getScene(key));
      });
    }
  }
}
