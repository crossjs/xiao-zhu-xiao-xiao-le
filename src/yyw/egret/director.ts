namespace yyw {
  interface ISceneManager {
    scenes?: { [key: string]: Base; };
    theStage?: eui.UILayer; // 设置所有场景所在的舞台(根)
    theScene?: Base; // 当前场景
    [key: string]: any;
  }

  /**
   * 场景管理类
   */
  export const director: ISceneManager = {
    init(scenes: Base[]) {
      this.scenes = scenes;
    },

    async escape(): Promise<void> {
      await this.theScene.exiting();
      removeElement(this.theScene);
    },

    async toScene(
      name: string,
      keepOther: boolean = false,
      callback?: any,
    ): Promise<Base> {
      // (根) 舞台
      const stage: egret.DisplayObjectContainer = this.theStage;
      const scene = this.getScene(name);

      if (!keepOther) {
        await this.removeOthers(name);
      }

      // 当前场景移到最前
      setZIndex(scene);

      // 判断场景是否有父级（如果有，说明已经被添加到了场景中）
      if (!scene.parent) {
        // 未被添加到场景，把场景添加到之前设置好的根舞台中
        stage.addChild(scene);
        this.theScene = scene;
        // 创建 Tween 对象
        await scene.entering();
      }

      if (callback) {
        // 回调
        callback(scene);
      }

      return scene;
    },

    /**
     * 设置根场景
     */
    setStage(stage: eui.UILayer) {
      this.theStage = stage;
    },

    /**
     * 获取指定场景
     */
    getScene(name: string): Base {
      return this.scenes[name];
    },

    /**
     * 删除其他场景
     * @param nameToKeep 不需要删除的场景的名字
     */
    removeOthers(nameToKeep: string) {
      return Promise.all(Object.keys(this.scenes)
      .filter((key) => key !== nameToKeep)
      .map(async (key) => {
        const scene = this.getScene(key);
        if (scene.parent) {
          await scene.exiting();
        }
        removeElement(scene);
      }));
    },
  };
}
