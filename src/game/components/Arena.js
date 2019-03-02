var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var game;
(function (game) {
    const SNAPSHOT_KEY = "YYW_G4_ARENA";
    class Arena extends yyw.Base {
        constructor() {
            super(...arguments);
            this.isGameOver = false;
            this.cellWidth = 144;
            this.cellHeight = 144;
            this.cols = 5;
            this.rows = 5;
            this.maxNum = 5;
            this.lives = 5;
            this.score = 0;
            this.combo = 0;
            this.running = false;
        }
        get isRunning() {
            return this.running;
        }
        set isRunning(running) {
            this.running = running;
            yyw.emit("ARENA_RUN", running);
        }
        async startGame(useSnapshot) {
            await this.createModel(useSnapshot);
            const { model } = this;
            yyw.matrixEach(this.cells, (cell, col, row) => {
                cell.setNumber(model.getNumberAt([col, row]));
            });
            if (useSnapshot) {
                const { lives, score, combo } = await yyw.storage.get(SNAPSHOT_KEY);
                this.ensureData({ lives, score, combo });
            }
            else {
                this.ensureData();
            }
            yyw.analysis.onStart();
        }
        onGameOver() {
            this.isGameOver = true;
            this.setSnapshot(null);
        }
        destroy() {
            this.setSnapshot(this.isGameOver ? null : undefined);
            this.resetCells();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.on("TOOL_USING", this.onToolUsing, this);
                yyw.on("GAME_OVER", this.onGameOver, this);
                this.createCells();
                this.initDnd();
            }
            this.isGameOver = false;
        }
        onToolUsing({ data: { type, targetX, targetY, confirm, cancel, } }) {
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
        }
        increaseLives(n) {
            this.lives = Math.max(0, Math.min(5, this.lives + n));
            for (let step = 1; step <= 5; step++) {
                const b = this[`b${step}`];
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
        }
        ensureData({ lives = 5, score = 0, combo = 0, } = {}) {
            this.lives = lives;
            this.increaseLives(0);
            this.score = score;
            this.increaseScore(0);
            this.combo = combo;
            this.notify();
        }
        resetCells() {
            yyw.matrixEach(this.cells, (cell) => {
                cell.reset();
            });
        }
        resetCellsZoom() {
            yyw.matrixEach(this.cells, (cell) => {
                cell.zoomOut();
            });
        }
        setSnapshot(value) {
            this.model.setSnapshot(value);
            if (value === null) {
                yyw.storage.set(SNAPSHOT_KEY, null);
            }
            else {
                const { lives, score, combo } = this;
                yyw.storage.set(SNAPSHOT_KEY, {
                    lives, score, combo,
                });
            }
        }
        async createModel(useSnapshot) {
            this.model = useSnapshot
                ? await game.Model.fromSnapshot()
                : new game.Model(this.cols, this.rows, this.maxNum);
        }
        createCells() {
            const { cellWidth, cellHeight, cols, rows, main } = this;
            const cells = this.cells = [];
            for (let row = 0; row < rows; row++) {
                const r = cells[row] = [];
                for (let col = 0; col < cols; col++) {
                    main.addChild(r[col] = new game.Cell(col, row, cellWidth, cellHeight));
                }
            }
        }
        x2p(x) {
            return Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.cellWidth)));
        }
        y2p(y) {
            return Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.cellHeight)));
        }
        initDnd() {
            const { main } = this;
            let fromXY;
            let fromPoint;
            const handleBegin = (e, cancel) => {
                if (this.running) {
                    cancel();
                    return;
                }
                const { localX, localY } = e;
                fromXY = [localX, localY];
                fromPoint = [
                    this.x2p(localX),
                    this.y2p(localY),
                ];
                this.getCellAt(fromPoint).zoomIn();
            };
            const handleDrag = async (e, cancel) => {
                const { localX, localY } = e;
                const toPoint = [
                    this.x2p(localX),
                    this.y2p(localY),
                ];
                if (!game.isNeighbor(fromPoint, toPoint)) {
                    return;
                }
                const toXY = [localX, localY];
                const slope = game.getSlope(toXY, fromXY);
                if (slope < 2 && slope > 0.5) {
                    return;
                }
                cancel();
                const cell = this.getCellAt(fromPoint);
                cell.zoomOut();
                yyw.setZIndex(cell);
                this.isRunning = true;
                game.SwapSound.play();
                this.tweenFromTo(fromPoint, toPoint, 300);
                await this.tweenFromTo(toPoint, fromPoint, 300);
                this.switchNumbers(fromPoint, toPoint);
                const numFrom = this.model.getNumberAt(fromPoint);
                const numTo = this.model.getNumberAt(toPoint);
                if (numFrom !== numTo) {
                    let magicPoint;
                    let numToGrowUp;
                    if (numFrom === game.MAGIC_NUMBER) {
                        magicPoint = fromPoint;
                        numToGrowUp = numTo;
                    }
                    else if (numTo === game.MAGIC_NUMBER) {
                        magicPoint = toPoint;
                        numToGrowUp = numFrom;
                    }
                    if (magicPoint) {
                        game.MagicSound.play();
                        await this.growUpCellsOf(numToGrowUp);
                        this.setCellNumber(magicPoint, 0);
                        await this.dropCellsDown();
                    }
                    this.resetCombo();
                    const hasChain = await this.mergeChains(toPoint, fromPoint);
                    if (!hasChain) {
                        this.increaseLives(-1);
                        if (this.lives === 0) {
                            yyw.emit("LIVES_EMPTY");
                        }
                    }
                }
                this.isRunning = false;
                this.notify();
            };
            const handleEnd = () => {
                if (this.running) {
                    return;
                }
                this.getCellAt(fromPoint).zoomOut();
            };
            yyw.onDnd(main, handleBegin, handleDrag, handleEnd, main.stage);
        }
        async growUpCellsOf(num) {
            const points = this.getPointsOf(num++);
            if (num > game.BIGGEST_NUMBER) {
                num = game.MAGIC_NUMBER;
            }
            await Promise.all(points.map(async (point) => {
                await this.getCellAt(point).tweenUp();
                return this.setCellNumber(point, num);
            }));
            if (num === game.MAGIC_NUMBER) {
                yyw.emit("MAGIC_GOT");
            }
        }
        getPointsOf(num) {
            const matchedPoints = [];
            const { model, cols, rows } = this;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const point = [col, row];
                    if (model.getNumberAt(point) === num) {
                        matchedPoints.push(point);
                    }
                }
            }
            return matchedPoints;
        }
        increaseScore(n) {
            this.score += n;
            this.model.setLevel(Math.floor(this.score / 3000));
            this.flashScore();
        }
        async flashScore() {
            const tween = yyw.getTween(this.tfdScore);
            await tween.to({ scale: 1.5 });
            this.tfdScore.text = yyw.zeroPadding(`${this.score}`, 5);
            await tween.to({ scale: 1 });
        }
        notify() {
            yyw.emit("GAME_DATA", {
                score: this.score,
                level: this.model.getLevel(),
                combo: this.combo,
            });
        }
        switchNumbers(from, to) {
            const { model } = this;
            const numFrom = model.getNumberAt(from);
            const numTo = model.getNumberAt(to);
            this.setCellNumber(from, numTo);
            this.setCellNumber(to, numFrom);
        }
        tweenFromTo(from, to, duration = 100, onResolve) {
            return this.getCellAt(from).tweenTo([{
                    x: (to[0] - from[0]) * this.cellWidth,
                    y: (to[1] - from[1]) * this.cellHeight,
                }], duration, onResolve);
        }
        resetCombo() {
            this.combo = 0;
        }
        increaseCombo() {
            this.combo++;
        }
        async mergeChains(triggerPoint, triggerPoint2) {
            const { model } = this;
            const firstNumber = triggerPoint ? model.getNumberAt(triggerPoint) : 0;
            const [num, points] = model.getMergeChain(firstNumber === game.MAGIC_NUMBER ? 0 : firstNumber);
            if (num) {
                this.increaseCombo();
                const isSF = game.isStraightFive(points);
                let triggerPointNext;
                if (!triggerPoint) {
                    triggerPoint = points.shift();
                }
                else {
                    let index = game.getIndexOf(points, triggerPoint);
                    if (index !== -1) {
                        points.splice(index, 1);
                        if (triggerPoint2) {
                            index = game.getIndexOf(points, triggerPoint2);
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
                game.PointSound.play();
                await Promise.all([...points.map((point) => {
                        const lives = game.getSteps(point, triggerPoint, points.filter((p) => !game.isEqual(p, point)));
                        return this.collapseCellBySteps(point, lives);
                    }), this.growUpCellAt(triggerPoint, isSF ? game.MAGIC_NUMBER : +num + 1)]);
                await this.dropCellsDown();
                if (!triggerPoint2) {
                    this.increaseLives(1);
                }
                await this.mergeChains(triggerPointNext);
            }
            return !!num;
        }
        async dropCellsDown() {
            const { model, cols, rows } = this;
            for (let col = 0; col < cols; col++) {
                let row = rows;
                while (row-- > 0) {
                    const point = [col, row];
                    const num = model.getNumberAt(point);
                    if (num === 0) {
                        if (row === 0) {
                            this.setCellNumber(point, model.getRandomNumber());
                        }
                        else {
                            let rowAbove = row;
                            let numAbove;
                            let pointAbove;
                            while (!numAbove && rowAbove--) {
                                pointAbove = [col, rowAbove];
                                numAbove = model.getNumberAt(pointAbove);
                            }
                            if (!numAbove) {
                                pointAbove = [col, 0];
                                this.setCellNumber(pointAbove, model.getRandomNumber());
                            }
                            await this.tweenFromTo(pointAbove, point, 50);
                            this.switchNumbers(pointAbove, point);
                        }
                    }
                }
            }
        }
        async growUpCellAt(point, num) {
            const cell = this.getCellAt(point);
            if (num === undefined) {
                num = cell.getNumber() + 1;
            }
            await cell.fadeOut();
            if (num > game.BIGGEST_NUMBER) {
                num = game.MAGIC_NUMBER;
            }
            this.setCellNumber(point, num);
            if (num === game.MAGIC_NUMBER) {
                yyw.emit("MAGIC_GOT");
            }
            await cell.fadeIn();
        }
        async collapseCellBySteps(from, lives) {
            let current = from;
            const increases = [];
            const length = lives.length;
            for (let i = 0; i < length; i++) {
                const step = lives[i];
                increases.push({
                    x: (step[0] - current[0]) * this.cellWidth,
                    y: (step[1] - current[1]) * this.cellHeight,
                });
                current = step;
            }
            increases.push({
                rotation: 1080,
                alpha: -1,
            });
            const cell = this.getCellAt(from);
            cell.flashScore();
            this.increaseScore(cell.getNumber() * 10);
            await cell.tweenTo(increases, 500, () => {
                this.setCellNumber(from, 0);
            });
        }
        getCellAt(point) {
            return this.cells[point[1]][point[0]];
        }
        setCellNumber(point, num) {
            this.model.setNumberAt(point, num);
            this.getCellAt(point).setNumber(num);
        }
        updateView() {
            const { cols, rows, model } = this;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const point = [col, row];
                    this.setCellNumber(point, model.getNumberAt(point));
                }
            }
        }
        preValueUp(x, y, cancel) {
            if (this.isRunning) {
                cancel();
                return;
            }
            this.resetCellsZoom();
            if (x === undefined || y === undefined) {
                cancel();
                return;
            }
            const cell = this.getCellAt([
                this.x2p(x),
                this.y2p(y),
            ]);
            cell.zoomIn();
        }
        async doValueUp(x, y, confirm) {
            if (this.isRunning) {
                return;
            }
            confirm();
            this.resetCells();
            const point = [
                this.x2p(x),
                this.y2p(y),
            ];
            this.isRunning = true;
            await this.growUpCellAt(point);
            this.getCellAt(point).zoomOut();
            await this.mergeChains(point);
            this.isRunning = false;
            this.notify();
        }
        async doShuffle(confirm) {
            confirm();
            this.isRunning = true;
            await yyw.twirlOut(this.main, 300);
            this.model.doShuffle();
            this.updateView();
            await yyw.twirlIn(this.main, 200);
            await this.mergeChains();
            this.isRunning = false;
            this.notify();
        }
        preBreaker(x, y, cancel) {
            if (this.isRunning) {
                cancel();
                return;
            }
            this.resetCellsZoom();
            if (x === undefined || y === undefined) {
                cancel();
                return;
            }
            const cell = this.getCellAt([
                this.x2p(x),
                this.y2p(y),
            ]);
            cell.zoomIn();
        }
        async doBreaker(x, y, confirm) {
            if (this.isRunning) {
                return;
            }
            confirm();
            this.resetCells();
            const point = [
                this.x2p(x),
                this.y2p(y),
            ];
            this.isRunning = true;
            const cell = this.getCellAt(point);
            await cell.fadeOut();
            this.setCellNumber(point, 0);
            await this.dropCellsDown();
            cell.fadeIn();
            await this.mergeChains(point);
            this.isRunning = false;
            this.notify();
        }
        doLivesUp(confirm) {
            confirm();
            this.increaseLives(1);
        }
    }
    __decorate([
        yyw.debounce()
    ], Arena.prototype, "flashScore", null);
    __decorate([
        yyw.debounce()
    ], Arena.prototype, "notify", null);
    game.Arena = Arena;
})(game || (game = {}));
