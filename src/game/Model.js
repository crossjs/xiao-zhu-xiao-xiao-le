var game;
(function (game) {
    game.MAGIC_NUMBER = 99;
    game.BIGGEST_NUMBER = 20;
    const SNAPSHOT_KEY = "YYW_G4_MODEL";
    class Model {
        constructor(cols = 5, rows = 5, maxNumber = 5, level = 1, matrix, numbers) {
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
        static async fromSnapshot() {
            const { cols, rows, maxNumber, level, matrix, numbers } = await yyw.storage.get(SNAPSHOT_KEY);
            return new Model(cols, rows, maxNumber, level, matrix, numbers);
        }
        setSnapshot(value) {
            if (value === null) {
                yyw.storage.set(SNAPSHOT_KEY, null);
            }
            else {
                const { cols, rows, maxNumber, level, matrix, numbers } = this;
                yyw.storage.set(SNAPSHOT_KEY, {
                    cols, rows, maxNumber, level, matrix, numbers,
                });
            }
        }
        setLevel(level) {
            this.level = level;
            this.minNumber = Math.max(1, this.maxNumber - 5 - level);
        }
        getLevel() {
            return this.level;
        }
        geNumbers() {
            return this.matrix;
        }
        getNumberAt(point) {
            return this.matrix[point[1]][point[0]];
        }
        setNumberAt(point, num) {
            if (num !== game.MAGIC_NUMBER) {
                this.maxNumber = Math.max(Math.min(20, num), this.maxNumber);
                this.setLevel(this.level);
            }
            this.saveNumberAt(point, num);
        }
        doShuffle() {
            const { numbers, cols, rows } = this;
            const slicedNumbers = numbers.slice(0);
            let row = rows;
            while (row--) {
                let col = cols;
                while (col--) {
                    const index = yyw.random(slicedNumbers.length);
                    this.saveNumberAt([col, row], slicedNumbers.splice(index, 1)[0]);
                }
            }
        }
        getMergeChain(firstNumber) {
            const numMap = {};
            const { matrix, cols, rows } = this;
            let row = rows;
            while (row--) {
                let col = cols;
                while (col--) {
                    const num = matrix[row][col];
                    if (num !== game.MAGIC_NUMBER) {
                        if (!numMap[`${num}`]) {
                            numMap[`${num}`] = [];
                        }
                        numMap[`${num}`].push([col, row]);
                    }
                }
            }
            const entries = Object.entries(numMap);
            if (firstNumber) {
                entries.sort(([num]) => +num === firstNumber ? -1 : 1);
            }
            for (const [num, points] of entries) {
                if (points.length < 3) {
                    continue;
                }
                const filteredPoints = points.filter((p) => !!getNeighborOf(p, points));
                for (let i = 0; i < filteredPoints.length; i++) {
                    const neighbors = [filteredPoints[i]];
                    for (let k = 0; k < filteredPoints.length - 1; k++) {
                        for (let j = 0; j < filteredPoints.length; j++) {
                            if (i !== j && neighbors.indexOf(filteredPoints[j]) === -1) {
                                if (neighbors.some((n) => isNeighbor(filteredPoints[j], n))) {
                                    neighbors.push(filteredPoints[j]);
                                }
                            }
                        }
                    }
                    if (neighbors.length >= 3) {
                        return [+num, neighbors];
                    }
                }
            }
            return [0, []];
        }
        getRandomNumber(exceptList) {
            const num = yyw.random((this.maxNumber - this.minNumber + 1)) + this.minNumber;
            if (exceptList) {
                if (exceptList.indexOf(num) !== -1) {
                    return this.getRandomNumber(exceptList);
                }
            }
            return num;
        }
        createNumbers() {
            this.matrix = [];
            this.numbers = [];
            const { cols, rows } = this;
            for (let row = 0; row < rows; row++) {
                this.matrix[row] = [];
                let num;
                for (let col = 0; col < cols; col++) {
                    const exceptList = [num];
                    if (col > 0) {
                        const num1 = this.getTwinsNumber(col - 1, row);
                        if (num1) {
                            exceptList.push(num1);
                        }
                    }
                    if (row > 0) {
                        const num2 = this.getTwinsNumber(col, row - 1);
                        if (num2) {
                            exceptList.push(num2);
                        }
                        if (col > 0) {
                            const num3 = this.matrix[row - 1][col];
                            if (num3 === this.matrix[row][col - 1]) {
                                exceptList.push(num3);
                            }
                        }
                    }
                    num = this.getRandomNumber(exceptList);
                    this.saveNumberAt([col, row], num);
                }
            }
        }
        getTwinsNumber(col, row) {
            const num = this.matrix[row][col];
            if (row > 0) {
                if (this.matrix[row - 1][col] === num) {
                    return num;
                }
            }
            if (row < this.rows - 1) {
                const r = this.matrix[row + 1];
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
        }
        saveNumberAt(point, num) {
            this.matrix[point[1]][point[0]] = num;
            this.numbers[point[1] * this.cols + point[0]] = num;
        }
    }
    game.Model = Model;
    function isNeighbor(point1, point2) {
        return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]) === 1;
    }
    game.isNeighbor = isNeighbor;
    function isEqual(point1, point2) {
        return point1[0] === point2[0] && point1[1] === point2[1];
    }
    game.isEqual = isEqual;
    function isStraightFive(points) {
        const map = {};
        for (const [x, y] of points) {
            const keyX = `x${x}`;
            const keyY = `y${y}`;
            if (!map[keyX]) {
                map[keyX] = 0;
            }
            map[keyX] += 1;
            if (!map[keyY]) {
                map[keyY] = 0;
            }
            map[keyY] += 1;
        }
        return Object.values(map).some((v) => v >= 5);
    }
    game.isStraightFive = isStraightFive;
    function getIndexOf(points, point) {
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (isEqual(p, point)) {
                return i;
            }
        }
        return -1;
    }
    game.getIndexOf = getIndexOf;
    function getNeighborOf(point, points) {
        for (const p of points) {
            if (isNeighbor(p, point)) {
                return p;
            }
        }
    }
    game.getNeighborOf = getNeighborOf;
    function getSteps(from, to, stops) {
        if (isNeighbor(from, to)) {
            return [to];
        }
        const steps = [];
        const clonedStops = stops.slice(0);
        let current = from;
        let stop;
        while ((stop = getNeighborOf(current, clonedStops))) {
            steps.push(stop);
            const index = clonedStops.indexOf(stop);
            clonedStops.splice(index, 1);
            current = stop;
            if (isNeighbor(current, to)) {
                steps.push(to);
                return steps;
            }
        }
        return getSteps(from, to, stops.filter((p) => {
            return steps.length === 0 || !isEqual(p, steps[steps.length - 1]);
        }));
    }
    game.getSteps = getSteps;
    function getSlope(point1, point2) {
        const dx = Math.abs(point1[0] - point2[0]);
        const dy = Math.abs(point1[1] - point2[1]);
        return dx === 0 ? Number.MAX_SAFE_INTEGER : dy / dx;
    }
    game.getSlope = getSlope;
})(game || (game = {}));
