namespace game {
  export type Scene = Landing & Playing & Ranking & Failing;

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

    public static setStage(stage: egret.DisplayObjectContainer): void {
      SceneManager.instance.setStage(stage);
    }

    public static getScene(name: string): Scene {
      return SceneManager.instance.getScene(name);
    }

    public static escape(): void {
      yyw.removeFromStage(SceneManager.instance.theScene);
    }

    public static toScene(
      name: string,
      keepOther?: boolean,
    ): Scene {
      // (根) 舞台
      const stage: egret.DisplayObjectContainer = SceneManager.instance.theStage;
      const scene = SceneManager.getScene(name);

      // 判断场景是否有父级（如果有，说明已经被添加到了场景中）
      if (!scene.parent) {
        if (keepOther) {
          scene.alpha = 0;
          // 创建 Tween 对象
          yyw.PromisedTween
          .get(scene)
          .to({ alpha: 1 }, 500);
        }
        // 未被添加到场景，把场景添加到之前设置好的根舞台中
        stage.addChild(scene);
        SceneManager.instance.theScene = scene;
      }

      if (!keepOther) {
        SceneManager.instance.removeOthers(name);
      }

      return scene;
    }
    private theStage: egret.DisplayObjectContainer; // 设置所有场景所在的舞台(根)
    private theScene: eui.Component; // 当前场景

    private scenes: {
      landing: Landing;
      pbl: Pbl;
      playing: Playing;
      ranking: Ranking;
      failing: Failing;
    };

    constructor() {
      this.scenes = {
        landing: new Landing(),
        pbl: new Pbl(),
        playing: new Playing(),
        ranking: new Ranking(),
        failing: new Failing(),
      };
    }

    /**
     * 设置根场景
     */
    public setStage(stage: egret.DisplayObjectContainer) {
      this.theStage = stage;
    }

    /**
     * 获取指定场景
     */
    private getScene(name: string): Scene {
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
        yyw.removeFromStage(this.getScene(key));
      });
    }
  }
}
