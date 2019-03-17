namespace yyw {
  type col = number;
  type row = number;

  export type Point = [ col, row ];

  const identify = (value: any, point?: Point) => value;
  const satisfy = (value: any, point?: Point) => true;

  export function traverseMatrix(
    matrix: any[][],
    handler: (value?: any, point?: Point) => any = identify,
    filter: (value: any, point?: Point) => boolean = satisfy,
  ): any[] {
    const arr = [];
    let row = matrix.length;
    while (row--) {
      const r = matrix[row];
      let col = r.length;
      while (col--) {
        const v = handler(r[col], [col, row]);
        if (filter(v)) {
          arr.push(v);
        }
      }
    }
    return arr;
  }
}
