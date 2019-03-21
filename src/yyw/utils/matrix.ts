namespace yyw {
  type col = number;
  type row = number;

  export type Point = [ col, row ];

  export function traverseMatrix(
    matrix: any[][],
    replacer?: (value?: any, point?: Point) => any,
  ): any[][] {
    const res = [];
    const rows = matrix.length;
    for (let row = 0; row < rows; row++) {
      res[row] = [];
      const r = matrix[row];
      const cols = r.length;
      for (let col = 0; col < cols; col++) {
        res[row].push(replacer ? replacer(r[col], [col, row]) : r[col]);
      }
    }
    return res;
  }
}
