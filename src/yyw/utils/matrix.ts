namespace yyw {
  type col = number;
  type row = number;

  export type Point = [ col, row ];

  export function traverseMatrix(matrix: any[][], handler: (value?: any, point?: Point) => any): void {
    let row = matrix.length;
    while (row--) {
      const r = matrix[row];
      let col = r.length;
      while (col--) {
        handler(r[col], [col, row]);
      }
    }
  }

  export function flattenMatrix(matrix: any[][]): any[] {
    const flattened = [];
    traverseMatrix(matrix, (value: any) => {
      // 因为使用的是反向广度优先遍历，
      // 所以次数要用 unshift，以保证数组以自然顺序返回
      flattened.unshift(value);
    });
    return flattened;
  }
}
