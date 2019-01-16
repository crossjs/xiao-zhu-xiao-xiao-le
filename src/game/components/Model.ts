namespace game {
  export type Point = [number, number];
  export type Matrix = number[][];

  export const MAGIC_NUMBER = 99;
  export const BIGGEST_NUMBER = 20;

  const SNAPSHOT_KEY = "YYW_G4_MODEL";

  export class Model {
    public static async restore(): Promise<Model> {
      const { cols, rows, maxNumber, level, matrix, numbers } = await yyw.getStorage(SNAPSHOT_KEY);
      return new Model(cols, rows, maxNumber, level, matrix, numbers);
    }

    private cols: number;
    private rows: number;
    /** 最大数值 */
    private maxNumber: number;
    /** 最小数值 */
    private minNumber: number;
    /** 难度系数 */
    private level: number;
    private matrix: Matrix;
    private numbers: number[];

    constructor(
      cols: number = 5,
      rows: number = 5,
      maxNumber: number = 5,
      level: number = 1,
      matrix?: Matrix,
      numbers?: number[],
    ) {
      this.cols = cols;
      this.rows = rows;
      this.maxNumber = maxNumber;
      this.setLevel(level);
      if (!(matrix && numbers)) {
        this.createNumbers();
      } else {
        this.matrix = matrix;
        this.numbers = numbers;
      }
    }

    public setSnapshot(value?: any) {
      if (value === null) {
        yyw.setStorage(SNAPSHOT_KEY, null);
      } else {
        const { cols, rows, maxNumber, level, matrix, numbers } = this;
        yyw.setStorage(SNAPSHOT_KEY, {
          cols, rows, maxNumber, level, matrix, numbers,
        });
      }
    }

    public setLevel(level: number) {
      this.level = level;
      this.minNumber = Math.max(1, this.maxNumber - 5 - level);
    }

    public getLevel(): number {
      return this.level;
    }

    public geNumbers(): Matrix {
      return this.matrix;
    }

    public getNumberAt(point: Point): number {
      return this.matrix[point[1]][point[0]];
    }

    public setNumberAt(point: Point, num: number) {
      if (num !== MAGIC_NUMBER) {
        this.maxNumber = Math.max(Math.min(20, num), this.maxNumber);
        // 通过刷新难度系数设置最小值
        this.setLevel(this.level);
        // TODO 寻找矩阵内的最小值
        // this.minNumber = Math.min(this.getMinNumberInNumbers(), this.minNumber);
      }
      this.saveNumberAt(point, num);
    }

    public shuffle() {
      const { numbers, cols, rows} = this;
      const slicedNumbers = numbers.slice(0);
      let row = rows;
      while (row--) {
        let col = cols;
        while (col--) {
          const index = Math.floor(Math.random() * slicedNumbers.length);
          this.saveNumberAt([col, row], slicedNumbers.splice(index, 1)[0]);
        }
      }
    }

    public getChain(firstNumber: number): [number, Point[]] {
      const numMap: { [num: string]: Point[] } = {};
      const { matrix, cols, rows} = this;
      let row = rows;
      while (row--) {
        let col = cols;
        while (col--) {
          const num  = matrix[row][col];
          if (num !== MAGIC_NUMBER) {
            if (!numMap[`${num}`]) {
              numMap[`${num}`] = [];
            }
            numMap[`${num}`].push([col, row]);
          }
        }
      }
      const entries = Object.entries(numMap);
      if (firstNumber) {
        // 指定的数字先检查
        entries.sort(([num]) => +num === firstNumber ? -1 : 1);
      }
      for (const [num, points] of entries) {
        if (points.length < 3) {
          continue;
        }
        // 剔除不存在邻居的点
        const filteredPoints = points.filter((p) => !!getNeighborOf(p, points));
        for (let i = 0; i < filteredPoints.length; i++) {
          const neighbors = [filteredPoints[i]];
          // 走 N-1 遍，避免漏网，比如 U 型结构
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

    /**
     * 在最大最小值之间取一个随机值
     * @param exceptList 排除的数字列表
     * @todo 高阶数字出现概率应低于低阶数字
     */
    public getRandomNumber(exceptList?: number[]): number {
      const num = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
      if (exceptList) {
        if (exceptList.indexOf(num) !== -1) {
          return this.getRandomNumber(exceptList);
        }
      }
      return num;
    }

    private createNumbers() {
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
      const { cols, rows } = this;
      for (let row = 0; row < rows; row++) {
        this.matrix[row] = [];
        let num: number;
        for (let col = 0; col < cols; col++) {
          // 将上一个值加入排除列表，以避免连续数字过多导致难度太低
          const exceptList = [num];
          if (col > 0) {
            const num1 = this.getTwinsNumber(col - 1, row);
            // 前两格如果连续，则应加入当前的排除列表
            if (num1) {
              exceptList.push(num1);
            }
          }
          if (row > 0) {
            const num2 = this.getTwinsNumber(col, row - 1);
            // 前两格如果连续，则应加入当前的排除列表
            if (num2) {
              exceptList.push(num2);
            }
            if (col > 0) {
              const num3 = this.matrix[row - 1][col];
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
    }

    private getTwinsNumber(col: number, row: number): number {
      const num = this.matrix[row][col];
      if (row > 0) {
        if (this.matrix[row - 1][col] === num) {
          return num;
        }
      }
      if (row < this.rows - 1) {
        const r = this.matrix[row + 1];
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
    }

    private saveNumberAt(point: Point, num: number) {
      this.matrix[point[1]][point[0]] = num;
      this.numbers[point[1] * this.cols + point[0]] = num;
    }
  }
}
