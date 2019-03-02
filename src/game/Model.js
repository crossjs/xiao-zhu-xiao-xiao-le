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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var game;
(function (game) {
    game.MAGIC_NUMBER = 99;
    game.BIGGEST_NUMBER = 20;
    var SNAPSHOT_KEY = "YYW_G4_MODEL";
    var Model = /** @class */ (function () {
        function Model(cols, rows, maxNumber, level, matrix, numbers) {
            if (cols === void 0) { cols = 5; }
            if (rows === void 0) { rows = 5; }
            if (maxNumber === void 0) { maxNumber = 5; }
            if (level === void 0) { level = 1; }
            this.cols = cols;
            this.rows = rows;
            this.maxNumber = maxNumber;
            this.setLevel(level);
            if (!(matrix && numbers)) {
                this.createNumbers();
            }
            else {
                this.matrix = matrix;
                this.numbers = numbers;
            }
        }
        Model.fromSnapshot = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cols, rows, maxNumber, level, matrix, numbers;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, yyw.storage.get(SNAPSHOT_KEY)];
                        case 1:
                            _a = _b.sent(), cols = _a.cols, rows = _a.rows, maxNumber = _a.maxNumber, level = _a.level, matrix = _a.matrix, numbers = _a.numbers;
                            return [2 /*return*/, new Model(cols, rows, maxNumber, level, matrix, numbers)];
                    }
                });
            });
        };
        Model.prototype.setSnapshot = function (value) {
            if (value === null) {
                yyw.storage.set(SNAPSHOT_KEY, null);
            }
            else {
                var _a = this, cols = _a.cols, rows = _a.rows, maxNumber = _a.maxNumber, level = _a.level, matrix = _a.matrix, numbers = _a.numbers;
                yyw.storage.set(SNAPSHOT_KEY, {
                    cols: cols, rows: rows, maxNumber: maxNumber, level: level, matrix: matrix, numbers: numbers,
                });
            }
        };
        Model.prototype.setLevel = function (level) {
            this.level = level;
            this.minNumber = Math.max(1, this.maxNumber - 5 - level);
        };
        Model.prototype.getLevel = function () {
            return this.level;
        };
        Model.prototype.geNumbers = function () {
            return this.matrix;
        };
        Model.prototype.getNumberAt = function (point) {
            return this.matrix[point[1]][point[0]];
        };
        Model.prototype.setNumberAt = function (point, num) {
            if (num !== game.MAGIC_NUMBER) {
                this.maxNumber = Math.max(Math.min(20, num), this.maxNumber);
                // 通过刷新难度系数设置最小值
                this.setLevel(this.level);
                // TODO 寻找矩阵内的最小值
                // this.minNumber = Math.min(this.getMinNumberInNumbers(), this.minNumber);
            }
            this.saveNumberAt(point, num);
        };
        /**
         * 对矩阵进行随机排列
         */
        Model.prototype.doShuffle = function () {
            var _a = this, numbers = _a.numbers, cols = _a.cols, rows = _a.rows;
            var slicedNumbers = numbers.slice(0);
            var row = rows;
            while (row--) {
                var col = cols;
                while (col--) {
                    var index = yyw.random(slicedNumbers.length);
                    this.saveNumberAt([col, row], slicedNumbers.splice(index, 1)[0]);
                }
            }
        };
        /**
         * 寻找可合并的数字链
         * @param firstNumber 优先合并的数字
         */
        Model.prototype.getMergeChain = function (firstNumber) {
            var e_1, _a;
            var numMap = {};
            var _b = this, matrix = _b.matrix, cols = _b.cols, rows = _b.rows;
            var row = rows;
            while (row--) {
                var col = cols;
                while (col--) {
                    var num = matrix[row][col];
                    if (num !== game.MAGIC_NUMBER) {
                        if (!numMap["" + num]) {
                            numMap["" + num] = [];
                        }
                        numMap["" + num].push([col, row]);
                    }
                }
            }
            var entries = Object.entries(numMap);
            if (firstNumber) {
                // 指定的数字先检查
                entries.sort(function (_a) {
                    var _b = __read(_a, 1), num = _b[0];
                    return +num === firstNumber ? -1 : 1;
                });
            }
            var _loop_1 = function (num, points) {
                if (points.length < 3) {
                    return "continue";
                }
                // 剔除不存在邻居的点
                var filteredPoints = points.filter(function (p) { return !!getNeighborOf(p, points); });
                for (var i = 0; i < filteredPoints.length; i++) {
                    var neighbors = [filteredPoints[i]];
                    // 走 N-1 遍，避免漏网，比如 U 型结构
                    for (var k = 0; k < filteredPoints.length - 1; k++) {
                        var _loop_2 = function (j) {
                            if (i !== j && neighbors.indexOf(filteredPoints[j]) === -1) {
                                if (neighbors.some(function (n) { return isNeighbor(filteredPoints[j], n); })) {
                                    neighbors.push(filteredPoints[j]);
                                }
                            }
                        };
                        for (var j = 0; j < filteredPoints.length; j++) {
                            _loop_2(j);
                        }
                    }
                    if (neighbors.length >= 3) {
                        return { value: [+num, neighbors] };
                    }
                }
            };
            try {
                for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var _c = __read(entries_1_1.value, 2), num = _c[0], points = _c[1];
                    var state_1 = _loop_1(num, points);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return [0, []];
        };
        /**
         * 在最大最小值之间取一个随机值
         * @param exceptList 排除的数字列表
         * @todo 高阶数字出现概率应低于低阶数字
         */
        Model.prototype.getRandomNumber = function (exceptList) {
            var num = yyw.random((this.maxNumber - this.minNumber + 1)) + this.minNumber;
            if (exceptList) {
                if (exceptList.indexOf(num) !== -1) {
                    return this.getRandomNumber(exceptList);
                }
            }
            return num;
        };
        Model.prototype.createNumbers = function () {
            this.matrix = [];
            this.numbers = [];
            // if (DEBUG) {
            //   this.matrix = [
            //     [4, 3, 3, 4, 3],
            //     [3, 19, 19, 7, 19],
            //     [3, 3, 99, 3, 3],
            //     [4, 4, 3, 4, 4],
            //     [3, 2, 4, 2, 3],
            //   ];
            //   this.numbers = [
            //     4, 6, 2, 4, 4,
            //     3, 1, 4, 7, 4,
            //     3, 6, 99, 2, 2,
            //     4, 4, 3, 4, 4,
            //     4, 2, 6, 1, 6,
            //   ];
            //   return;
            // }
            var _a = this, cols = _a.cols, rows = _a.rows;
            for (var row = 0; row < rows; row++) {
                this.matrix[row] = [];
                var num = void 0;
                for (var col = 0; col < cols; col++) {
                    // 将上一个值加入排除列表，以避免连续数字过多导致难度太低
                    var exceptList = [num];
                    if (col > 0) {
                        var num1 = this.getTwinsNumber(col - 1, row);
                        // 前两格如果连续，则应加入当前的排除列表
                        if (num1) {
                            exceptList.push(num1);
                        }
                    }
                    if (row > 0) {
                        var num2 = this.getTwinsNumber(col, row - 1);
                        // 前两格如果连续，则应加入当前的排除列表
                        if (num2) {
                            exceptList.push(num2);
                        }
                        if (col > 0) {
                            var num3 = this.matrix[row - 1][col];
                            // 如果上面与左边的格子相等，那么自己不能跟他们相等
                            if (num3 === this.matrix[row][col - 1]) {
                                exceptList.push(num3);
                            }
                        }
                    }
                    num = this.getRandomNumber(exceptList);
                    this.saveNumberAt([col, row], num);
                }
            }
        };
        Model.prototype.getTwinsNumber = function (col, row) {
            var num = this.matrix[row][col];
            if (row > 0) {
                if (this.matrix[row - 1][col] === num) {
                    return num;
                }
            }
            if (row < this.rows - 1) {
                var r = this.matrix[row + 1];
                // 可能还没初始化
                if (r && r[col] === num) {
                    return num;
                }
            }
            if (col > 0) {
                if (this.matrix[row][col - 1] === num) {
                    return num;
                }
            }
            if (col < this.cols - 1) {
                if (this.matrix[row][col + 1] === num) {
                    return num;
                }
            }
            return 0;
        };
        Model.prototype.saveNumberAt = function (point, num) {
            this.matrix[point[1]][point[0]] = num;
            this.numbers[point[1] * this.cols + point[0]] = num;
        };
        return Model;
    }());
    game.Model = Model;
    function isNeighbor(point1, point2) {
        return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]) === 1;
    }
    game.isNeighbor = isNeighbor;
    function isEqual(point1, point2) {
        return point1[0] === point2[0] && point1[1] === point2[1];
    }
    game.isEqual = isEqual;
    /** 是否存在 5 个在一条线上 */
    function isStraightFive(points) {
        var e_2, _a;
        var map = {};
        try {
            for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                var _b = __read(points_1_1.value, 2), x = _b[0], y = _b[1];
                var keyX = "x" + x;
                var keyY = "y" + y;
                if (!map[keyX]) {
                    map[keyX] = 0;
                }
                map[keyX] += 1;
                if (!map[keyY]) {
                    map[keyY] = 0;
                }
                map[keyY] += 1;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return Object.values(map).some(function (v) { return v >= 5; });
    }
    game.isStraightFive = isStraightFive;
    function getIndexOf(points, point) {
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (isEqual(p, point)) {
                return i;
            }
        }
        return -1;
    }
    game.getIndexOf = getIndexOf;
    function getNeighborOf(point, points) {
        var e_3, _a;
        try {
            for (var points_2 = __values(points), points_2_1 = points_2.next(); !points_2_1.done; points_2_1 = points_2.next()) {
                var p = points_2_1.value;
                if (isNeighbor(p, point)) {
                    return p;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (points_2_1 && !points_2_1.done && (_a = points_2.return)) _a.call(points_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    game.getNeighborOf = getNeighborOf;
    /**
     * 获取路径
     * @param from 起点
     * @param to 重点
     * @param stops 可能的中途点
     */
    function getSteps(from, to, stops) {
        // 如果是邻居，直接返回
        if (isNeighbor(from, to)) {
            return [to];
        }
        var steps = [];
        var clonedStops = stops.slice(0);
        var current = from;
        var stop;
        while ((stop = getNeighborOf(current, clonedStops))) {
            steps.push(stop);
            // 移除已匹配到的，避免回环
            var index = clonedStops.indexOf(stop);
            clonedStops.splice(index, 1);
            current = stop;
            if (isNeighbor(current, to)) {
                steps.push(to);
                return steps;
            }
        }
        // 没找到，换个方向
        return getSteps(from, to, stops.filter(function (p) {
            return steps.length === 0 || !isEqual(p, steps[steps.length - 1]);
        }));
    }
    game.getSteps = getSteps;
    function getSlope(point1, point2) {
        var dx = Math.abs(point1[0] - point2[0]);
        var dy = Math.abs(point1[1] - point2[1]);
        return dx === 0 ? Number.MAX_SAFE_INTEGER : dy / dx;
    }
    game.getSlope = getSlope;
})(game || (game = {}));
