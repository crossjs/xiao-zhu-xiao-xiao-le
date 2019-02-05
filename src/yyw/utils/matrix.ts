namespace yyw {
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
