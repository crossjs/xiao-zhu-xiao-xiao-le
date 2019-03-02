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
    var Ranking = /** @class */ (function (_super) {
        __extends(Ranking, _super);
        function Ranking() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // 0, 64, 122, 278
            _this.pageSize = 5;
            _this.pageIndex = 0;
            return _this;
        }
        Ranking.prototype.destroy = function () {
            this.removeFriend();
            this.removeWorld();
        };
        /**
         * 准备榜单
         */
        Ranking.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        yyw.onTap(this.btnFriend, function () {
                            _this.removeWorld();
                            _this.showFriend();
                        });
                        yyw.onTap(this.btnWorld, function () {
                            _this.removeFriend();
                            _this.showWorld();
                        });
                    }
                    this.showFriend();
                    return [2 /*return*/];
                });
            });
        };
        Ranking.prototype.showFriend = function () {
            this.hdrFriend.visible = true;
            this.btnWorld.visible = true;
            var _a = this.groupFriend, width = _a.width, height = _a.height;
            var bmpFriend = yyw.sub.createDisplayObject(null, width, height);
            this.groupFriend.addChild(bmpFriend);
            // 主域向子域发送自定义消息
            yyw.sub.postMessage({
                command: "openRanking",
                width: width,
                height: height,
                openid: yyw.USER.openid || 0,
                pageSize: this.pageSize,
            });
            yyw.analysis.addEvent("7进入场景", { s: "好友排行" });
        };
        Ranking.prototype.showWorld = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.hdrWorld.visible = true;
                            this.btnFriend.visible = true;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _a = this;
                            return [4 /*yield*/, yyw.pbl.all()];
                        case 2:
                            _a.rankingData = _b.sent();
                            this.myRankingData = this.rankingData.find(function (_a) {
                                var openid = _a.openid;
                                return yyw.USER.openid === openid;
                            });
                            this.pageTotal = Math.ceil(this.rankingData.length / this.pageSize);
                            this.groupWorld.visible = true;
                            this.drawRanking();
                            // 渲染自己
                            this.drawRankingItem(this.myRankingData, this.pageSize);
                            this.initScroll();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _b.sent();
                            yyw.showToast("当前无数据");
                            return [3 /*break*/, 4];
                        case 4:
                            yyw.analysis.addEvent("7进入场景", { s: "世界排行" });
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 创建排行榜
         */
        Ranking.prototype.drawRanking = function () {
            var _this = this;
            // 获取当前要渲染的数据组
            // 起始 id
            var startID = this.pageSize * this.pageIndex;
            var pageItems = this.rankingData.slice(startID, startID + this.pageSize);
            var n = this.pageSize - pageItems.length;
            while (n--) {
                pageItems.push(null);
            }
            // 创建 body
            pageItems.forEach(function (data, index) {
                // 创建行
                _this.drawRankingItem(data, index);
            });
        };
        /**
         * 根据绘制信息以及当前i绘制元素
         */
        Ranking.prototype.drawRankingItem = function (data, i) {
            var r = this["r" + i];
            r.setData(data);
        };
        Ranking.prototype.initScroll = function () {
            var _this = this;
            var startX = 0;
            var startY = 0;
            if (this.offDnd) {
                this.offDnd();
            }
            this.offDnd = yyw.onDnd(this.groupWorld, function (e, cancel) {
                if (_this.pageTotal <= 1) {
                    cancel();
                    return;
                }
                startX = e.stageX;
                startY = e.stageY;
            }, function () {
                // nothing to do
            }, function (e) {
                var dx = e.stageX - startX;
                var dy = e.stageY - startY;
                // 不使用 1 判断斜率，而留有余量，防止误触
                if (Math.abs(dy / dx) > 2) {
                    _this.goPage(dy > 0 ? -1 : 1);
                }
            });
        };
        /**
         * -1 为上一页
         * 1 为下一页
         */
        Ranking.prototype.goPage = function (offset) {
            if (this.pageIndex === undefined) {
                return;
            }
            this.pageIndex += offset;
            if (this.pageIndex < 0) {
                this.pageIndex = 0;
                return;
            }
            if (this.pageIndex >= this.pageTotal) {
                this.pageIndex = this.pageTotal - 1;
                return;
            }
            this.drawRanking();
        };
        Ranking.prototype.removeFriend = function () {
            this.hdrFriend.visible = false;
            this.btnWorld.visible = false;
            yyw.removeChildren(this.groupFriend);
            yyw.sub.postMessage({
                command: "closeRanking",
            });
        };
        Ranking.prototype.removeWorld = function () {
            this.hdrWorld.visible = false;
            this.btnFriend.visible = false;
            this.groupWorld.visible = false;
            if (this.offDnd) {
                this.offDnd();
                this.offDnd = null;
            }
        };
        return Ranking;
    }(yyw.Base));
    game.Ranking = Ranking;
})(game || (game = {}));
