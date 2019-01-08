namespace game {
  export type Point = [number, number];
  export type Numbers = number[][];

  export const MAGIC_NUMBER = 99;

  export class Model {
    private cols: number;
    private rows: number;
    /** 最大数值 */
    private maxNumber: number;
    /** 最小数值 */
    private minNumber: number;
    /** 难度系数 */
    private difficulty: number;
    private numbers: Numbers;

    constructor(cols: number = 5, rows: number = 5, maxNumber: number = 5, difficulty: number = 1) {
      this.cols = cols;
      this.rows = rows;
      this.maxNumber = maxNumber;
      this.setDifficulty(difficulty);
      this.createNumbers();
    }

    public setDifficulty(difficulty: number) {
      this.difficulty = difficulty;
      this.minNumber = Math.max(1, this.maxNumber - 5 - difficulty);
    }

    public getDifficulty(): number {
      return this.difficulty;
    }

    public geNumbers(): Numbers {
      return this.numbers;
    }

    public getNumberAt(point: Point): number {
      return this.numbers[point[1]][point[0]];
    }

    public setNumberAt(point: Point, num: number) {
      if (num !== game.MAGIC_NUMBER) {
        this.maxNumber = Math.max(Math.min(20, num), this.maxNumber);
        // 通过刷新难度系数设置最小值
        this.setDifficulty(this.difficulty);
        // TODO 寻找矩阵内的最小值
        // this.minNumber = Math.min(this.getMinNumberInNumbers(), this.minNumber);
      }
      this.numbers[point[1]][point[0]] = num;
    }

    public getChain(firstNumber: number): [number, Point[]] {
      const numMap: { [num: string]: Point[] } = {};
      const { numbers, cols, rows} = this;
      let row = rows;
      while (row--) {
        let col = cols;
        while (col--) {
          const num  = numbers[row][col];
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
        // 指定的数字先检查
        entries.sort(([num]) => +num === firstNumber ? -1 : 1);
      }
      for (const [num, points] of entries) {
        if (points.length < 3) {
          continue;
        }
        // 剔除不存在邻居的点
        const filteredPoints = points.filter((p) => !!yyw.getNeighborOf(p, points));
        for (let i = 0; i < filteredPoints.length; i++) {
          const neighbors = [filteredPoints[i]];
          // 走 N-1 遍，避免漏网，比如 U 型结构
          for (let k = 0; k < filteredPoints.length - 1; k++) {
            for (let j = 0; j < filteredPoints.length; j++) {
              if (i !== j && neighbors.indexOf(filteredPoints[j]) === -1) {
                if (neighbors.some((n) => yyw.isNeighbor(filteredPoints[j], n))) {
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

    // private getRBLNumbers(col: number, row: number, validate: (num: number) => boolean): Point[] {
    //   const arr = [];
    //   if (col < this.cols - 1) {
    //     const num = this.numbers[row][col + 1];
    //     arr[0] = validate(num) ? [col + 1, row] : false;
    //   }
    //   if (row < this.rows - 1) {
    //     const num = this.numbers[row + 1][col];
    //     arr[1] = validate(num) ? [col, row + 1] : false;
    //   }
    //   if (col > 0) {
    //     const num = this.numbers[row][col - 1];
    //     arr[2] = validate(num) ? [col - 1, row] : false;
    //   }
    //   if (row > 0) {
    //     const num = this.numbers[row - 1][col];
    //     arr[3] = validate(num) ? [col, row - 1] : false;
    //   }
    //   return arr;
    // }

    private createNumbers() {
      this.numbers = [];
      for (let row = 0; row < this.rows; row++) {
        const r = this.numbers[row] = [];
        let num: number;
        for (let col = 0; col < this.cols; col++) {
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
              const num3 = this.numbers[row - 1][col];
              // 如果上面与左边的格子相等，那么自己不能跟他们相等
              if (num3 === this.numbers[row][col - 1]) {
                exceptList.push(num3);
              }
            }
          }
          num = this.getRandomNumber(exceptList);
          r[col] = num;
        }
      }
    }

    private getTwinsNumber(col: number, row: number): number {
      const num = this.numbers[row][col];
      if (row > 0) {
        if (this.numbers[row - 1][col] === num) {
          return num;
        }
      }
      if (row < this.rows - 1) {
        const r = this.numbers[row + 1];
        // 可能还没初始化
        if (r && r[col] === num) {
          return num;
        }
      }
      if (col > 0) {
        if (this.numbers[row][col - 1] === num) {
          return num;
        }
      }
      if (col < this.cols - 1) {
        if (this.numbers[row][col + 1] === num) {
          return num;
        }
      }
      return 0;
    }
  }
}
