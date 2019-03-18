namespace yyw {
  export type Matrix = number[][];

  export const MAGIC_NUMBER = 99;
  export const BOMB_NUMBER = 98;
  export const PENDING_NUMBER = 0;
  export const NIL_NUMBER = -1;
  export const BIGGEST_NUMBER = 20;

  export const MAX_COLS = 8;
  export const MAX_ROWS = 8;

  export class Model {
    public static create(useSnapshot: boolean = false): Model {
      if (useSnapshot) {
        const { cols, rows, maxNum, matrix } = USER.arena[CONFIG.mode];
        return new Model(cols, rows, maxNum, matrix);
      }
      const { limit: { cols, rows, maxNum } } = Levels.current();
      return new Model(cols, rows, maxNum);
    }

    constructor(
      private cols: number,
      private rows: number,
      private maxNum?: number,
      private matrix?: Matrix,
    ) {
      if (!this.maxNum) {
        this.maxNum = Math.min(this.cols, this.rows);
      }
      if (!this.matrix) {
        this.createMatrix();
      }
    }

    public getSnapshot() {
      const { maxNum, matrix } = this;
      return { maxNum, matrix };
    }

    public getNumberAt([ col, row ]: Point): number {
      return this.matrix[row][col];
    }

    public setNumberAt([ col, row ]: Point, num: number) {
      this.matrix[row][col] = num;
    }

    /**
     * 在最大最小值之间取一个随机值
     * @param exceptList 排除的数字列表
     */
    public getRandomNumber(exceptList?: number[]): number {
      const num = random(1, this.maxNum + 1);
      if (exceptList && exceptList.indexOf(num) !== -1) {
        return this.getRandomNumber(exceptList);
      }
      return num;
    }

    private createMatrix() {
      this.matrix = [];
      const { limit: { nil = [], cols, rows } } = Levels.current();
      for (let row = 0; row < rows; row++) {
        this.matrix[row] = [];
        let num: number;
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          if (nil.indexOf(index) !== -1) {
            num = NIL_NUMBER;
          } else {
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
          }
          this.setNumberAt([col, row], num);
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
  }
}
