namespace game {
  // game.Landing | game.Playing | game.Ranking | game.Failing;
  export type Scene = any;

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

    public static getScene(name: string): Scene {
      return SceneManager.instance.getScene(name);
    }

    public static escape(): void {
      const { theScene } = SceneManager.instance;
      if (theScene) {
        if (theScene.parent) {
          theScene.parent.removeChild(theScene);
        }
      }
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
          egret.Tween
          .get(scene)
          .to({ alpha: 1 }, 500)
          .call(() => {
            egret.log(`scene ${name} show!`);
          }, this);
        }
        egret.log(`add ${name} to stage`);
        // 未被添加到场景，把场景添加到之前设置好的根舞台中
        stage.addChild(scene);
        SceneManager.instance.theScene = scene;
      }

      if (!keepOther) {
        SceneManager.instance.removeOther(name);
      }

      return scene;
    }
    private theStage: egret.DisplayObjectContainer; // 设置所有场景所在的舞台(根)
    private theScene: eui.Component; // 当前场景

    private scenes: {
      landing: game.Landing;
      playing: game.Playing;
      ranking: game.Ranking;
      failing: game.Failing;
    };

    constructor() {
      this.scenes = {
        landing: new game.Landing(),
        playing: new game.Playing(),
        ranking: new game.Ranking(),
        failing: new game.Failing(),
      };
    }

    /**
     * 设置根场景
     */
    public setStage(s: egret.DisplayObjectContainer) {
      this.theStage = s;
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
    private removeOther(name: string) {
      Object.keys(this.scenes)
      .filter((key) => key !== name)
      .forEach((key) => {
        const scene = this.getScene(key);
        if (scene.parent) {
          // console.log(`remove ${key} from stage`);
          scene.parent.removeChild(scene);
        }
      });
    }
  }
}
