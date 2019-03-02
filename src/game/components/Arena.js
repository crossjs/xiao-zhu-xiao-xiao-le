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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var game;
(function (game) {
    var SNAPSHOT_KEY = "YYW_G4_ARENA";
    var Arena = /** @class */ (function (_super) {
        __extends(Arena, _super);
        function Arena() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isGameOver = false;
            _this.cellWidth = 144;
            _this.cellHeight = 144;
            _this.cols = 5;
            _this.rows = 5;
            _this.maxNum = 5;
            /** 可用的剩余步数 */
            _this.lives = 5;
            _this.score = 0;
            /** 连击数 */
            _this.combo = 0;
            /** 是否正在执行（动画等） */
            _this.running = false;
            return _this;
        }
        Object.defineProperty(Arena.prototype, "isRunning", {
            get: function () {
                return this.running;
            },
            set: function (running) {
                this.running = running;
                yyw.emit("ARENA_RUN", running);
            },
            enumerable: true,
            configurable: true
        });
        Arena.prototype.startGame = function (useSnapshot) {
            return __awaiter(this, void 0, void 0, function () {
                var model, _a, lives, score, combo;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.createModel(useSnapshot)];
                        case 1:
                            _b.sent();
                            model = this.model;
                            yyw.matrixEach(this.cells, function (cell, col, row) {
                                cell.setNumber(model.getNumberAt([col, row]));
                            });
                            if (!useSnapshot) return [3 /*break*/, 3];
                            return [4 /*yield*/, yyw.storage.get(SNAPSHOT_KEY)];
                        case 2:
                            _a = _b.sent(), lives = _a.lives, score = _a.score, combo = _a.combo;
                            this.ensureData({ lives: lives, score: score, combo: combo });
                            return [3 /*break*/, 4];
                        case 3:
                            this.ensureData();
                            _b.label = 4;
                        case 4:
                            yyw.analysis.onStart();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.onGameOver = function () {
            this.isGameOver = true;
            this.setSnapshot(null);
        };
        Arena.prototype.destroy = function () {
            this.setSnapshot(this.isGameOver ? null : undefined);
            this.resetCells();
        };
        Arena.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        yyw.on("TOOL_USING", this.onToolUsing, this);
                        yyw.on("GAME_OVER", this.onGameOver, this);
                        this.createCells();
                        this.initDnd();
                    }
                    this.isGameOver = false;
                    return [2 /*return*/];
                });
            });
        };
        Arena.prototype.onToolUsing = function (_a) {
            var _b = _a.data, type = _b.type, targetX = _b.targetX, targetY = _b.targetY, confirm = _b.confirm, cancel = _b.cancel;
            switch (type) {
                case "valueUp":
                    if (cancel) {
                        return this.preValueUp(targetX, targetY, cancel);
                    }
                    return this.doValueUp(targetX, targetY, confirm);
                case "shuffle":
                    return this.doShuffle(confirm);
                case "breaker":
                    if (cancel) {
                        return this.preBreaker(targetX, targetY, cancel);
                    }
                    return this.doBreaker(targetX, targetY, confirm);
                case "livesUp":
                    if (this.lives >= 5) {
                        if (cancel) {
                            return cancel();
                        }
                        return yyw.showToast("体力已满");
                    }
                    return this.doLivesUp(confirm);
                default:
                    return;
            }
        };
        /**
         * 更新剩余步骤及其显示
         */
        Arena.prototype.increaseLives = function (n) {
            this.lives = Math.max(0, Math.min(5, this.lives + n));
            for (var step = 1; step <= 5; step++) {
                var b = this["b" + step];
                if (step <= this.lives) {
                    yyw.nude(b);
                }
                else {
                    yyw.gray(b);
                }
            }
            if (n < 0) {
                if (this.lives === 1) {
                    yyw.emit("LIVES_LEAST");
                }
            }
        };
        Arena.prototype.ensureData = function (_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.lives, lives = _c === void 0 ? 5 : _c, _d = _b.score, score = _d === void 0 ? 0 : _d, _e = _b.combo, combo = _e === void 0 ? 0 : _e;
            this.lives = lives;
            this.increaseLives(0);
            this.score = score;
            this.increaseScore(0);
            this.combo = combo;
            this.notify();
        };
        Arena.prototype.resetCells = function () {
            yyw.matrixEach(this.cells, function (cell) {
                cell.reset();
            });
        };
        Arena.prototype.resetCellsZoom = function () {
            yyw.matrixEach(this.cells, function (cell) {
                cell.zoomOut();
            });
        };
        Arena.prototype.setSnapshot = function (value) {
            this.model.setSnapshot(value);
            if (value === null) {
                yyw.storage.set(SNAPSHOT_KEY, null);
            }
            else {
                var _a = this, lives = _a.lives, score = _a.score, combo = _a.combo;
                yyw.storage.set(SNAPSHOT_KEY, {
                    lives: lives, score: score, combo: combo,
                });
            }
        };
        Arena.prototype.createModel = function (useSnapshot) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this;
                            if (!useSnapshot) return [3 /*break*/, 2];
                            return [4 /*yield*/, game.Model.fromSnapshot()];
                        case 1:
                            _b = _c.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _b = new game.Model(this.cols, this.rows, this.maxNum);
                            _c.label = 3;
                        case 3:
                            _a.model = _b;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.createCells = function () {
            var _a = this, cellWidth = _a.cellWidth, cellHeight = _a.cellHeight, cols = _a.cols, rows = _a.rows, main = _a.main;
            var cells = this.cells = [];
            for (var row = 0; row < rows; row++) {
                var r = cells[row] = [];
                for (var col = 0; col < cols; col++) {
                    main.addChild(r[col] = new game.Cell(col, row, cellWidth, cellHeight));
                }
            }
        };
        Arena.prototype.x2p = function (x) {
            return Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.cellWidth)));
        };
        Arena.prototype.y2p = function (y) {
            return Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.cellHeight)));
        };
        Arena.prototype.initDnd = function () {
            var _this = this;
            var main = this.main;
            // 起始点
            var fromXY;
            // 起始单元格
            var fromPoint;
            var handleBegin = function (e, cancel) {
                if (_this.running) {
                    cancel();
                    return;
                }
                var localX = e.localX, localY = e.localY;
                fromXY = [localX, localY];
                fromPoint = [
                    _this.x2p(localX),
                    _this.y2p(localY),
                ];
                _this.getCellAt(fromPoint).zoomIn();
            };
            var handleDrag = function (e, cancel) { return __awaiter(_this, void 0, void 0, function () {
                var localX, localY, toPoint, toXY, slope, cell, numFrom, numTo, magicPoint, numToGrowUp, hasChain;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            localX = e.localX, localY = e.localY;
                            toPoint = [
                                this.x2p(localX),
                                this.y2p(localY),
                            ];
                            // 角度太模棱两可的，不处理
                            if (!game.isNeighbor(fromPoint, toPoint)) {
                                return [2 /*return*/];
                            }
                            toXY = [localX, localY];
                            slope = game.getSlope(toXY, fromXY);
                            if (slope < 2 && slope > 0.5) {
                                return [2 /*return*/];
                            }
                            cancel();
                            cell = this.getCellAt(fromPoint);
                            cell.zoomOut();
                            yyw.setZIndex(cell);
                            this.isRunning = true;
                            // 普通交换
                            game.SwapSound.play();
                            this.tweenFromTo(fromPoint, toPoint, 300);
                            return [4 /*yield*/, this.tweenFromTo(toPoint, fromPoint, 300)];
                        case 1:
                            _a.sent();
                            this.switchNumbers(fromPoint, toPoint);
                            numFrom = this.model.getNumberAt(fromPoint);
                            numTo = this.model.getNumberAt(toPoint);
                            if (!(numFrom !== numTo)) return [3 /*break*/, 6];
                            magicPoint = void 0;
                            numToGrowUp = void 0;
                            if (numFrom === game.MAGIC_NUMBER) {
                                magicPoint = fromPoint;
                                numToGrowUp = numTo;
                            }
                            else if (numTo === game.MAGIC_NUMBER) {
                                magicPoint = toPoint;
                                numToGrowUp = numFrom;
                            }
                            if (!magicPoint) return [3 /*break*/, 4];
                            // 魔法效果
                            game.MagicSound.play();
                            return [4 /*yield*/, this.growUpCellsOf(numToGrowUp)];
                        case 2:
                            _a.sent();
                            this.setCellNumber(magicPoint, 0);
                            return [4 /*yield*/, this.dropCellsDown()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            this.resetCombo();
                            return [4 /*yield*/, this.mergeChains(toPoint, fromPoint)];
                        case 5:
                            hasChain = _a.sent();
                            if (!hasChain) {
                                this.increaseLives(-1);
                                if (this.lives === 0) {
                                    // 体力耗尽
                                    yyw.emit("LIVES_EMPTY");
                                }
                            }
                            _a.label = 6;
                        case 6:
                            this.isRunning = false;
                            this.notify();
                            return [2 /*return*/];
                    }
                });
            }); };
            var handleEnd = function () {
                if (_this.running) {
                    return;
                }
                _this.getCellAt(fromPoint).zoomOut();
            };
            yyw.onDnd(main, handleBegin, handleDrag, handleEnd, main.stage);
        };
        Arena.prototype.growUpCellsOf = function (num) {
            return __awaiter(this, void 0, void 0, function () {
                var points;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            points = this.getPointsOf(num++);
                            if (num > game.BIGGEST_NUMBER) {
                                num = game.MAGIC_NUMBER;
                            }
                            return [4 /*yield*/, Promise.all(points.map(function (point) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getCellAt(point).tweenUp()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, this.setCellNumber(point, num)];
                                        }
                                    });
                                }); }))];
                        case 1:
                            _a.sent();
                            // 棒棒糖
                            if (num === game.MAGIC_NUMBER) {
                                yyw.emit("MAGIC_GOT");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.getPointsOf = function (num) {
            var matchedPoints = [];
            var _a = this, model = _a.model, cols = _a.cols, rows = _a.rows;
            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    var point = [col, row];
                    if (model.getNumberAt(point) === num) {
                        matchedPoints.push(point);
                    }
                }
            }
            return matchedPoints;
        };
        /**
         * 更新分数
         */
        Arena.prototype.increaseScore = function (n) {
            this.score += n;
            this.model.setLevel(Math.floor(this.score / 3000));
            this.flashScore();
        };
        Arena.prototype.flashScore = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tween;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tween = yyw.getTween(this.tfdScore);
                            return [4 /*yield*/, tween.to({ scale: 1.5 })];
                        case 1:
                            _a.sent();
                            this.tfdScore.text = yyw.zeroPadding("" + this.score, 5);
                            return [4 /*yield*/, tween.to({ scale: 1 })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.notify = function () {
            yyw.emit("GAME_DATA", {
                score: this.score,
                level: this.model.getLevel(),
                combo: this.combo,
            });
        };
        Arena.prototype.switchNumbers = function (from, to) {
            var model = this.model;
            var numFrom = model.getNumberAt(from);
            var numTo = model.getNumberAt(to);
            this.setCellNumber(from, numTo);
            this.setCellNumber(to, numFrom);
        };
        Arena.prototype.tweenFromTo = function (from, to, duration, onResolve) {
            if (duration === void 0) { duration = 100; }
            return this.getCellAt(from).tweenTo([{
                    x: (to[0] - from[0]) * this.cellWidth,
                    y: (to[1] - from[1]) * this.cellHeight,
                }], duration, onResolve);
        };
        Arena.prototype.resetCombo = function () {
            this.combo = 0;
        };
        Arena.prototype.increaseCombo = function () {
            this.combo++;
        };
        /** 寻找可合并的数字链 */
        Arena.prototype.mergeChains = function (triggerPoint, triggerPoint2) {
            return __awaiter(this, void 0, void 0, function () {
                var model, firstNumber, _a, num, points, isSF, triggerPointNext, index;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            model = this.model;
                            firstNumber = triggerPoint ? model.getNumberAt(triggerPoint) : 0;
                            _a = __read(model.getMergeChain(firstNumber === game.MAGIC_NUMBER ? 0 : firstNumber), 2), num = _a[0], points = _a[1];
                            if (!num) return [3 /*break*/, 4];
                            this.increaseCombo();
                            isSF = game.isStraightFive(points);
                            triggerPointNext = void 0;
                            if (!triggerPoint) {
                                triggerPoint = points.shift();
                            }
                            else {
                                index = game.getIndexOf(points, triggerPoint);
                                // triggerPoint 在合并链里
                                if (index !== -1) {
                                    points.splice(index, 1);
                                    if (triggerPoint2) {
                                        index = game.getIndexOf(points, triggerPoint2);
                                        // triggerPoint2 不在合并链里，才往下传
                                        if (index === -1) {
                                            triggerPointNext = triggerPoint2;
                                        }
                                    }
                                }
                                else {
                                    if (triggerPoint2) {
                                        index = game.getIndexOf(points, triggerPoint2);
                                        if (index !== -1) {
                                            triggerPointNext = triggerPoint;
                                            triggerPoint = triggerPoint2;
                                            points.splice(index, 1);
                                        }
                                        else {
                                            triggerPoint = points.shift();
                                        }
                                    }
                                    else {
                                        triggerPoint = points.shift();
                                    }
                                }
                            }
                            // 播放得分音效
                            game.PointSound.play();
                            // 同步合并
                            return [4 /*yield*/, Promise.all(__spread(points.map(function (point) {
                                    var lives = game.getSteps(point, triggerPoint, points.filter(function (p) { return !game.isEqual(p, point); }));
                                    return _this.collapseCellBySteps(point, lives);
                                }), [this.growUpCellAt(triggerPoint, isSF ? game.MAGIC_NUMBER : +num + 1)]))];
                        case 1:
                            // 同步合并
                            _b.sent();
                            return [4 /*yield*/, this.dropCellsDown()];
                        case 2:
                            _b.sent();
                            // 如果连击，则增加剩余步骤数
                            if (!triggerPoint2) {
                                this.increaseLives(1);
                            }
                            // 继续找，优先消除交换点
                            return [4 /*yield*/, this.mergeChains(triggerPointNext)];
                        case 3:
                            // 继续找，优先消除交换点
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, !!num];
                    }
                });
            });
        };
        Arena.prototype.dropCellsDown = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, model, cols, rows, col, row, point, num, rowAbove, numAbove, pointAbove;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this, model = _a.model, cols = _a.cols, rows = _a.rows;
                            col = 0;
                            _b.label = 1;
                        case 1:
                            if (!(col < cols)) return [3 /*break*/, 7];
                            row = rows;
                            _b.label = 2;
                        case 2:
                            if (!(row-- > 0)) return [3 /*break*/, 6];
                            point = [col, row];
                            num = model.getNumberAt(point);
                            if (!(num === 0)) return [3 /*break*/, 5];
                            if (!(row === 0)) return [3 /*break*/, 3];
                            this.setCellNumber(point, model.getRandomNumber());
                            return [3 /*break*/, 5];
                        case 3:
                            rowAbove = row;
                            numAbove = void 0;
                            pointAbove = void 0;
                            while (!numAbove && rowAbove--) {
                                pointAbove = [col, rowAbove];
                                numAbove = model.getNumberAt(pointAbove);
                            }
                            if (!numAbove) {
                                pointAbove = [col, 0];
                                this.setCellNumber(pointAbove, model.getRandomNumber());
                            }
                            return [4 /*yield*/, this.tweenFromTo(pointAbove, point, 50)];
                        case 4:
                            _b.sent();
                            this.switchNumbers(pointAbove, point);
                            _b.label = 5;
                        case 5: return [3 /*break*/, 2];
                        case 6:
                            col++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.growUpCellAt = function (point, num) {
            return __awaiter(this, void 0, void 0, function () {
                var cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cell = this.getCellAt(point);
                            if (num === undefined) {
                                num = cell.getNumber() + 1;
                            }
                            return [4 /*yield*/, cell.fadeOut()];
                        case 1:
                            _a.sent();
                            if (num > game.BIGGEST_NUMBER) {
                                num = game.MAGIC_NUMBER;
                            }
                            this.setCellNumber(point, num);
                            // 棒棒糖
                            if (num === game.MAGIC_NUMBER) {
                                yyw.emit("MAGIC_GOT");
                            }
                            return [4 /*yield*/, cell.fadeIn()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.collapseCellBySteps = function (from, lives) {
            return __awaiter(this, void 0, void 0, function () {
                var current, increases, length, i, step, cell;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            current = from;
                            increases = [];
                            length = lives.length;
                            for (i = 0; i < length; i++) {
                                step = lives[i];
                                // 位移
                                increases.push({
                                    x: (step[0] - current[0]) * this.cellWidth,
                                    y: (step[1] - current[1]) * this.cellHeight,
                                });
                                current = step;
                            }
                            // 旋转
                            increases.push({
                                rotation: 1080,
                                alpha: -1,
                            });
                            cell = this.getCellAt(from);
                            cell.flashScore();
                            this.increaseScore(cell.getNumber() * 10);
                            return [4 /*yield*/, cell.tweenTo(increases, 500, function () {
                                    _this.setCellNumber(from, 0);
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Arena.prototype.getCellAt = function (point) {
            return this.cells[point[1]][point[0]];
        };
        Arena.prototype.setCellNumber = function (point, num) {
            // 先更新模型
            this.model.setNumberAt(point, num);
            // 再设置 UI
            this.getCellAt(point).setNumber(num);
        };
        Arena.prototype.updateView = function () {
            var _a = this, cols = _a.cols, rows = _a.rows, model = _a.model;
            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    var point = [col, row];
                    this.setCellNumber(point, model.getNumberAt(point));
                }
            }
        };
        /**
         * 指定单元格数字+1
         */
        Arena.prototype.preValueUp = function (x, y, cancel) {
            if (this.isRunning) {
                cancel();
                return;
            }
            this.resetCellsZoom();
            if (x === undefined || y === undefined) {
                cancel();
                return;
            }
            var cell = this.getCellAt([
                this.x2p(x),
                this.y2p(y),
            ]);
            cell.zoomIn();
        };
        /**
         * 指定单元格数字+1
         */
        Arena.prototype.doValueUp = function (x, y, confirm) {
            return __awaiter(this, void 0, void 0, function () {
                var point;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isRunning) {
                                return [2 /*return*/];
                            }
                            // 确定消费
                            confirm();
                            this.resetCells();
                            point = [
                                this.x2p(x),
                                this.y2p(y),
                            ];
                            // 开始工作
                            this.isRunning = true;
                            return [4 /*yield*/, this.growUpCellAt(point)];
                        case 1:
                            _a.sent();
                            this.getCellAt(point).zoomOut();
                            return [4 /*yield*/, this.mergeChains(point)];
                        case 2:
                            _a.sent();
                            this.isRunning = false;
                            this.notify();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 随机重排
         */
        Arena.prototype.doShuffle = function (confirm) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 确定消费
                            confirm();
                            // 开始工作
                            this.isRunning = true;
                            return [4 /*yield*/, yyw.twirlOut(this.main, 300)];
                        case 1:
                            _a.sent();
                            this.model.doShuffle();
                            this.updateView();
                            return [4 /*yield*/, yyw.twirlIn(this.main, 200)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.mergeChains()];
                        case 3:
                            _a.sent();
                            this.isRunning = false;
                            this.notify();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 销毁指定单元格
         */
        Arena.prototype.preBreaker = function (x, y, cancel) {
            if (this.isRunning) {
                cancel();
                return;
            }
            this.resetCellsZoom();
            if (x === undefined || y === undefined) {
                cancel();
                return;
            }
            var cell = this.getCellAt([
                this.x2p(x),
                this.y2p(y),
            ]);
            cell.zoomIn();
        };
        /**
         * 销毁指定单元格
         */
        Arena.prototype.doBreaker = function (x, y, confirm) {
            return __awaiter(this, void 0, void 0, function () {
                var point, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isRunning) {
                                return [2 /*return*/];
                            }
                            // 确定消费
                            confirm();
                            this.resetCells();
                            point = [
                                this.x2p(x),
                                this.y2p(y),
                            ];
                            // 开始工作
                            this.isRunning = true;
                            cell = this.getCellAt(point);
                            return [4 /*yield*/, cell.fadeOut()];
                        case 1:
                            _a.sent();
                            this.setCellNumber(point, 0);
                            return [4 /*yield*/, this.dropCellsDown()];
                        case 2:
                            _a.sent();
                            cell.fadeIn();
                            return [4 /*yield*/, this.mergeChains(point)];
                        case 3:
                            _a.sent();
                            this.isRunning = false;
                            this.notify();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 增加体力
         */
        Arena.prototype.doLivesUp = function (confirm) {
            // 确定消费
            confirm();
            // 开始工作
            this.increaseLives(1);
        };
        __decorate([
            yyw.debounce()
        ], Arena.prototype, "flashScore", null);
        __decorate([
            yyw.debounce()
        ], Arena.prototype, "notify", null);
        return Arena;
    }(yyw.Base));
    game.Arena = Arena;
})(game || (game = {}));
