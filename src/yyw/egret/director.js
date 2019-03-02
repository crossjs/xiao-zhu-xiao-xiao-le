var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var yyw;
(function (yyw) {
    /**
     * 场景管理类
     */
    yyw.director = {
        init: function (scenes) {
            this.scenes = scenes;
        },
        escape: function () {
            return __awaiter(this, void 0, void 0, function () {
                var scene;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            scene = this.getScene(this.currentName);
                            return [4 /*yield*/, scene.exiting()];
                        case 1:
                            _a.sent();
                            yyw.removeElement(scene);
                            yyw.emit("SCENE_ESCAPED", { name: this.currentName });
                            return [2 /*return*/];
                    }
                });
            });
        },
        toScene: function (name, keepOther, callback) {
            if (keepOther === void 0) { keepOther = false; }
            return __awaiter(this, void 0, void 0, function () {
                var stage, scene;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stage = this.stageLayer;
                            scene = this.getScene(name);
                            if (!!keepOther) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.removeOthers(name)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            // 当前场景移到最前
                            yyw.setZIndex(scene);
                            if (!!scene.parent) return [3 /*break*/, 4];
                            yyw.emit("SCENE_ENTERING", { name: name });
                            // 未被添加到场景，把场景添加到之前设置好的根舞台中
                            stage.addChild(scene);
                            this.currentName = name;
                            // 创建 Tween 对象
                            return [4 /*yield*/, scene.entering()];
                        case 3:
                            // 创建 Tween 对象
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (callback) {
                                // 回调
                                callback(scene);
                            }
                            return [2 /*return*/, scene];
                    }
                });
            });
        },
        /**
         * 设置根场景
         */
        setStage: function (stage) {
            this.stageLayer = stage;
        },
        /**
         * 获取指定场景
         */
        getScene: function (name) {
            return this.scenes[name];
        },
        /**
         * 删除其他场景
         * @param nameToKeep 不需要删除的场景的名字
         */
        removeOthers: function (nameToKeep) {
            var _this = this;
            return Promise.all(Object.keys(this.scenes)
                .filter(function (key) { return key !== nameToKeep; })
                .map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                var scene;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            scene = this.getScene(key);
                            if (!scene.parent) return [3 /*break*/, 2];
                            return [4 /*yield*/, scene.exiting()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            yyw.removeElement(scene);
                            return [2 /*return*/];
                    }
                });
            }); }));
        },
    };
})(yyw || (yyw = {}));
