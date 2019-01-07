namespace game {
  export type Point = [number, number];
  export type Numbers = number[][];

  export class Model {
    private cols: number;
    private rows: number;
    private maxNum: number;
    private numbers: Numbers;

    constructor(cols: number = 5, rows: number = 5, maxNum: number = 5) {
      this.cols = cols;
      this.rows = rows;
      this.maxNum = maxNum;
      this.createNumbers();
    }

    public geNumbers(): Numbers {
      return this.numbers;
    }

    public getNumberAt(point: Point): number {
      return this.numbers[point[1]][point[0]];
    }

    public setNumberAt(point: Point, value: number) {
      this.numbers[point[1]][point[0]] = value;
    }

    public getChain(firstNumber: number): [number, Point[]] {
      const numMap: { [num: number]: Point[] } = {};
      const numbers = this.numbers;
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const num  = numbers[row][col];
          if (!numMap[num]) {
            numMap[num] = [];
          }
          numMap[num].push([col, row]);
        }
      }
      let matchedNum: any;
      let matchedPoints: any;
      function checkPoints([num, points]: [string, Point[]]): boolean {
        if (points.length < 3) {
          egret.log(`${num} 不足 3 个，跳过检查`);
          return;
        }
        for (let i = 0; i < points.length; i++) {
          const neighbors = [points[i]];
          for (let j = 0; j < points.length; j++) {
            if (i !== j && neighbors.indexOf(points[j]) === -1) {
              if (neighbors.some((n) => yyw.isNeighbor(points[j], n))) {
                neighbors.push(points[j]);
              }
            }
          }
          // 再走一遍，避免漏网，比如 U 型结构
          for (let j = 0; j < points.length; j++) {
            if (i !== j && neighbors.indexOf(points[j]) === -1) {
              if (neighbors.some((n) => yyw.isNeighbor(points[j], n))) {
                neighbors.push(points[j]);
              }
            }
          }
          if (neighbors.length >= 3) {
            matchedNum = num;
            matchedPoints = neighbors;
            return true;
          }
        }
        return false;
      }
      const entries = Object.entries(numMap);
      if (firstNumber) {
        // 指定的数字先检查
        entries.sort(([num]) => +num === firstNumber ? -1 : 1);
      }
      // egret.log("entries", firstNumber, entries);
      entries.some(checkPoints);
      return [matchedNum, matchedPoints];
    }

    public getRandomNumber(exceptList?: number[]) {
      const num = Math.floor(Math.random() * this.maxNum) + 1;
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
        for (let col = 0; col < this.cols; col++) {
          const exceptList = [];
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
          const num = this.getRandomNumber(exceptList);
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
