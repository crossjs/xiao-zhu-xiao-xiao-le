namespace game {
  export type CellMatrix = Cell[][];

  export class Cells extends yyw.Base {
    public static isStraightFive(cells: Cell[]): boolean {
      const map = {};
      for (const { col, row } of cells) {
        const keyCol = `x${col}`;
        const keyRow = `y${row}`;
        if (!map[keyCol]) {
          map[keyCol] = 0;
        }
        map[keyCol] += 1;
        if (!map[keyRow]) {
          map[keyRow] = 0;
        }
        map[keyRow] += 1;
      }
      return Object.values(map).some((v) => v >= 5);
    }

    public static isEqual(cell1: Cell, cell2: Cell): boolean {
      return cell1.col === cell2.col && cell1.row === cell2.row;
    }

    public static getIndexOf(cells: Cell[], cell: Cell): number {
      for (let i = 0; i < cells.length; i++) {
        if (Cells.isEqual(cells[i], cell)) {
          return i;
        }
      }
      return -1;
    }

    public static getNeighborCellOf(cell: Cell, cells: Cell[]): Cell {
      for (const c of cells) {
        if (Cells.isNeighborCells(c, cell)) {
          return c;
        }
      }
    }

    public static isNeighborCells(cell1: Cell, cell2: Cell): boolean {
      return Math.abs(cell1.col - cell2.col) + Math.abs(cell1.row - cell2.row) === 1;
    }

    /**
     * 获取路径
     * @param from 起点
     * @param to 终点
     * @param stops 可能的中途点
     */
    public static getSteps(from: Cell, to: Cell, stops: Cell[]): Cell[] {
      // 如果是邻居，直接返回
      if (Cells.isNeighborCells(from, to)) {
        return [to];
      }
      const steps = [];
      const clonedStops = stops.slice(0);
      let current = from;
      let stop: Cell;
      while ((stop = Cells.getNeighborCellOf(current, clonedStops))) {
        steps.push(stop);
        // 移除已匹配到的，避免回环
        const index = clonedStops.indexOf(stop);
        clonedStops.splice(index, 1);
        current = stop;
        if (Cells.isNeighborCells(current, to)) {
          steps.push(to);
          return steps;
        }
      }
      // 没找到，换个方向
      return Cells.getSteps(
        from,
        to,
        stops.filter((c) => {
          return steps.length === 0 || !Cells.isEqual(c, steps[steps.length - 1]);
        }),
      );
    }

    private cellMatrix: CellMatrix;
    private model: Model;

    public async startup(useSnapshot: boolean = false) {
      this.model = Model.create(useSnapshot);
      yyw.traverseMatrix(this.cellMatrix, (cell: Cell, point) => {
        cell.setNumber(this.model.getNumberAt(point));
        if ( yyw.CONFIG.mode === "level") {
          const { limit: { fixed = [], black = [] } } = Levels.current();
          const index = cell.getIndex();
          if (fixed.indexOf(index) !== -1) {
            cell.setType(CELL_TYPES.FIXED);
          } else if (black.indexOf(index) !== -1) {
            cell.setType(CELL_TYPES.BLACK);
          } else {
            cell.setType(CELL_TYPES.NORMAL);
          }
        } else {
          cell.setType(CELL_TYPES.NORMAL);
        }
      });
    }

    public getSnapshot() {
      return this.model.getSnapshot();
    }

    public getMatrix(): CellMatrix {
      return this.cellMatrix;
    }

    public getCellAt(point: number | Point | Cell): Cell {
      if (point instanceof Cell) {
        return point;
      }
      if (typeof point === "number") {
        point = index2point(point);
      }
      const [ col, row ] = point;
      return this.cellMatrix[row][col];
    }

    public getNumberAt(point: Point | Cell): number {
      return this.getCellAt(point).getNumber();
    }

    public setNumberAt(point: Point | Cell, num: number = this.model.getRandomNumber()) {
      const cell = this.getCellAt(point);
      this.model.setNumberAt([cell.col, cell.row], num);
      return cell.setNumber(num);
    }

    public traverse(handler: (value?: any, point?: Point) => any) {
      yyw.traverseMatrix(this.cellMatrix, handler);
    }

    public flatten(): Cell[] {
      return yyw.flattenMatrix(this.cellMatrix);
    }

    /**
     * 寻找可合并的数字链
     * @param firstNumber 优先合并的数字
     */
    public getChain(firstNumber: number): [number, Cell[]] {
      const numMap: { [num: string]: Cell[] } = {};
      // 先按数字序列化，以便于将长度不足的先剔除
      yyw.traverseMatrix(this.cellMatrix, (cell: Cell) => {
        const num = cell.getNumber();
        const key = `${num}`;
        if (num !== MAGIC_NUMBER) {
          if (!numMap[key]) {
            numMap[key] = [];
          }
          numMap[key].push(cell);
        }
      });
      const entries = Object.entries(numMap);
      if (firstNumber) {
        // 指定的数字先检查
        entries.sort(([num]) => +num === firstNumber ? -1 : 1);
      }
      for (const [num, cells] of entries) {
        if (cells.length < 3) {
          continue;
        }
        // 剔除不存在邻居的点
        const filteredCells = cells.filter((c) => !!Cells.getNeighborCellOf(c, cells));
        for (let i = 0; i < filteredCells.length; i++) {
          const neighbors = [filteredCells[i]];
          // 走 N-1 遍，避免漏网，比如 U 型结构
          for (let k = 0; k < filteredCells.length - 1; k++) {
            for (let j = 0; j < filteredCells.length; j++) {
              if (i !== j && neighbors.indexOf(filteredCells[j]) === -1) {
                if (neighbors.some((n) => Cells.isNeighborCells(filteredCells[j], n))) {
                  neighbors.push(filteredCells[j]);
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

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);
      if (fromChildrenCreated) {
        const cm = this.cellMatrix = [];
        for (let row = 0; row < ROWS; row++) {
          const r = cm[row] = [];
          for (let col = 0; col < COLS; col++) {
            const c = r[col] = new Cell(col, row);
            this.main.addChild(c);
          }
        }
      }
    }
  }
}
