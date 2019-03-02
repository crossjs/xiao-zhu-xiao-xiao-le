var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var game;
(function (game) {
    var SNAPSHOT_KEY = "YYW_G4_TOOLS";
    var Tools = /** @class */ (function (_super) {
        __extends(Tools, _super);
        function Tools() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.valueUp = yyw.CONFIG.toolAmount;
            _this.shuffle = yyw.CONFIG.toolAmount;
            _this.breaker = yyw.CONFIG.toolAmount;
            _this.livesUp = yyw.CONFIG.toolAmount;
            return _this;
        }
        Object.defineProperty(Tools.prototype, "targetRect", {
            set: function (targetRect) {
                this.tools.forEach(function (tool) {
                    tool.targetRect = targetRect;
                });
            },
            enumerable: true,
            configurable: true
        });
        Tools.prototype.startTool = function (useSnapshot) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!useSnapshot) return [3 /*break*/, 2];
                            return [4 /*yield*/, yyw.storage.get(SNAPSHOT_KEY)];
                        case 1:
                            snapshot = _a.sent();
                            if (snapshot) {
                                Object.assign(this, snapshot);
                            }
                            _a.label = 2;
                        case 2:
                            this.tools.forEach(function (tool) {
                                tool.setAmount(_this[tool.type]);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        Tools.prototype.destroy = function () {
            var _this = this;
            this.tools.forEach(function (tool) {
                _this[tool.type] = tool.getAmount();
            });
            yyw.storage.set(SNAPSHOT_KEY, {
                valueUp: this.valueUp,
                shuffle: this.shuffle,
                breaker: this.breaker,
                livesUp: this.livesUp,
            });
        };
        Tools.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        this.tools = [
                            this.toolValueUp,
                            this.toolShuffle,
                            this.toolBreaker,
                            this.toolLivesUp,
                        ];
                        yyw.on("ARENA_RUN", function (_a) {
                            var running = _a.data;
                            _this.enabled = !running;
                        });
                        yyw.on("RANDOM_TOOL", function () {
                            yyw.randomChild(_this.main).increaseAmount(1);
                        });
                    }
                    return [2 /*return*/];
                });
            });
        };
        return Tools;
    }(yyw.Base));
    game.Tools = Tools;
})(game || (game = {}));
