var yyw;
(function (yyw) {
    yyw.director = {
        init(scenes) {
            this.scenes = scenes;
        },
        async escape() {
            const scene = this.getScene(this.currentName);
            await scene.exiting();
            yyw.removeElement(scene);
            yyw.emit("SCENE_ESCAPED", { name: this.currentName });
        },
        async toScene(name, keepOther = false, callback) {
            const stage = this.stageLayer;
            const scene = this.getScene(name);
            if (!keepOther) {
                await this.removeOthers(name);
            }
            yyw.setZIndex(scene);
            if (!scene.parent) {
                yyw.emit("SCENE_ENTERING", { name });
                stage.addChild(scene);
                this.currentName = name;
                await scene.entering();
            }
            if (callback) {
                callback(scene);
            }
            return scene;
        },
        setStage(stage) {
            this.stageLayer = stage;
        },
        getScene(name) {
            return this.scenes[name];
        },
        removeOthers(nameToKeep) {
            return Promise.all(Object.keys(this.scenes)
                .filter((key) => key !== nameToKeep)
                .map(async (key) => {
                const scene = this.getScene(key);
                if (scene.parent) {
                    await scene.exiting();
                }
                yyw.removeElement(scene);
            }));
        },
    };
})(yyw || (yyw = {}));
