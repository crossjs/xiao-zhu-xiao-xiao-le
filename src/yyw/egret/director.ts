namespace yyw {
  const scenesStack = new Stack(true);
  const scenesMap: any = {};
  let stageLayer: eui.UILayer;

  /**
   * 场景管理类
   */
  export const director = {
    init(scenes: { [name: string]: Base }) {
      Object.assign(scenesMap, scenes);
    },

    async escape(): Promise<void> {
      const name = scenesStack.pop();
      if (name) {
        const scene = this.getScene(name);
        await scene.exiting();
        removeElement(scene);
        emit("SCENE_ESCAPED", { name });
      }
    },

    async toScene(
      name: string,
      keepOther: boolean = false,
      callback?: (scene: Base) => void,
    ): Promise<Base> {
      // (根) 舞台
      const stage: egret.DisplayObjectContainer = stageLayer;
      const scene = this.getScene(name);

      if (keepOther) {
        scenesStack.add(name);
      } else {
        await this.removeOthers(name);
      }

      // 当前场景移到最前
      setZIndex(scene);

      // 判断场景是否有父级（如果有，说明已经被添加到了场景中）
      if (!scene.parent) {
        emit("SCENE_ENTERING", { name });
        // 未被添加到场景，把场景添加到之前设置好的根舞台中
        stage.addChild(scene);
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
      stageLayer = stage;
    },

    /**
     * 获取指定场景
     */
    getScene(name: string): Base {
      return scenesMap[name];
    },

    /**
     * 删除其他场景
     * @param nameToKeep 不需要删除的场景的名字
     */
    removeOthers(nameToKeep: string) {
      return Promise.all(Object.keys(scenesMap)
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
