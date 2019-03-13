namespace game {
  export type Point = yyw.Point;
  export type Matrix = number[][];

  export const MAGIC_NUMBER = 99;
  export const BIGGEST_NUMBER = 20;

  export const COLS = 5;
  export const ROWS = 5;

  export class Model {
    public static create(useSnapshot: boolean = false): Model {
      if (useSnapshot) {
        const { maxNum, matrix } = yyw.USER.arena[yyw.CONFIG.mode];
        return new Model(maxNum, matrix);
      }
      return new Model();
    }

    constructor(
      /** 最大数值 */
      private maxNum: number = 5,
      private matrix?: Matrix,
    ) {
      if (!this.matrix) {
        this.createMatrix();
      }
      if (yyw.CONFIG.mode === "level") {
        const { limit: { black = [] } } = yyw.CONFIG.levels[yyw.CONFIG.level - 1];

        black.forEach((point: number | Point) => {
          if (typeof point === "number") {
            point = index2point(point);
          }
          this.setNumberAt(point, -1);
        });
      }
    }

    public getSnapshot() {
      const { maxNum, matrix } = this;
      return { maxNum, matrix };
    }

    public getMatrix(): Matrix {
      return this.matrix;
    }

    public getItemAt(): Matrix {
      return this.matrix;
    }

    public getNumberAt([ col, row ]: Point): number {
      return this.matrix[row][col];
    }

    public setNumberAt(point: Point, num: number) {
      if (num !== MAGIC_NUMBER) {
        this.maxNum = Math.max(Math.min(20, num), this.maxNum);
      }
      this.saveNumberAt(point, num);
    }

    /**
     * 在最大最小值之间取一个随机值
     * @param exceptList 排除的数字列表
     * @todo 高阶数字出现概率应低于低阶数字
     */
    public getRandomNumber(exceptList?: number[]): number {
      const num = yyw.random(this.maxNum - 4, this.maxNum + 1);
      if (exceptList) {
        if (exceptList.indexOf(num) !== -1) {
          return this.getRandomNumber(exceptList);
        }
      }
      return num;
    }

    /**
     * 寻找可合并的数字链
     * @param firstNumber 优先合并的数字
     */
    public getChain(firstNumber: number): [number, Point[]] {
      const numMap: { [num: string]: Point[] } = {};
      yyw.traverseMatrix(this.matrix, (num: number, point) => {
        if (num !== MAGIC_NUMBER) {
          if (!numMap[`${num}`]) {
            numMap[`${num}`] = [];
          }
          numMap[`${num}`].push(point);
        }
      });
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
                if (neighbors.some((n) => isNeighborPoints(filteredPoints[j], n))) {
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

    private createMatrix() {
      this.matrix = [];
      // if (DEBUG) {
      //   this.matrix = [
      //     [4, 3, 3, 4, 3],
      //     [3, 19, 19, 7, 19],
      //     [3, 3, 99, 3, 3],
      //     [4, 4, 3, 4, 4],
      //     [3, 2, 4, 2, 3],
      //   ];
      //   return;
      // }
      for (let row = 0; row < ROWS; row++) {
        this.matrix[row] = [];
        let num: number;
        for (let col = 0; col < COLS; col++) {
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
      if (row < ROWS - 1) {
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
      if (col < COLS - 1) {
        if (this.matrix[row][col + 1] === num) {
          return num;
        }
      }
      return 0;
    }

    private saveNumberAt([ col, row ]: Point, num: number) {
      this.matrix[row][col] = num;
    }
  }

  export function index2point(index: number): Point {
    return [index % COLS, Math.floor(index / COLS)];
  }

  export function isNeighborPoints(point1: Point, point2: Point): boolean {
    return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]) === 1;
  }

  function getNeighborOf(point: Point, points: Point[]): Point {
    for (const p of points) {
      if (isNeighborPoints(p, point)) {
        return p;
      }
    }
  }
}
