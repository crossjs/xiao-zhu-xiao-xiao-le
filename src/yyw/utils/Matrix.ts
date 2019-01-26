namespace yyw {
  export class Matrix {
    private matrix: any[][];

    constructor(matrix: any[][]) {
      this.matrix = matrix;
    }

    public get(col: number, row: number): any {
      return this.matrix[row][col];
    }

    public set(col: number, row: number, data: any): any {
      this.matrix[row][col] = data;
    }

    public async each(handler: any): Promise<void> {
      const { matrix } = this;
      const rows = matrix.length;
      for (let row = 0; row < rows; row++) {
        const r = matrix[row];
        const cols = r.length;
        for (let col = 0; col < cols; col++) {
          await handler(r[col], col, row);
        }
      }
    }
  }

  export function matrixEach(matrix: any[][], handler: any): void {
    const rows = matrix.length;
    for (let row = 0; row < rows; row++) {
      const r = matrix[row];
      const cols = r.length;
      for (let col = 0; col < cols; col++) {
        handler(r[col], col, row);
      }
    }
  }
}
