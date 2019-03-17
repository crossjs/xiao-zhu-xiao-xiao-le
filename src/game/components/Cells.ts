namespace game {
  export type CellMatrix = Cell[][];

  export class Cells extends yyw.Base {
    public static shapeOf(cells: Cell[]): number {
      const mapCol = {};
      const mapRow = {};
      for (const { col, row } of cells) {
        const keyCol = `x${col}`;
        const keyRow = `y${row}`;
        if (!mapCol[keyCol]) {
          mapCol[keyCol] = 0;
        }
        mapCol[keyCol] += 1;
        if (!mapRow[keyRow]) {
          mapRow[keyRow] = 0;
        }
        mapRow[keyRow] += 1;
      }
      if (Object.values(mapCol).some((v) => v >= 5)
        || Object.values(mapRow).some((v) => v >= 5)) {
        // ooooo
        return CELL_TYPES.MAGIC;
      }
      if (Object.values(mapCol).some((v) => v >= 3)
        && Object.values(mapRow).some((v) => v >= 3)) {
        //  o
        // ooo
        //  o
        return CELL_TYPES.BOMB;
      }
      return CELL_TYPES.DEF;
    }

    public static isSame(cell1: Cell, cell2: Cell): boolean {
      return cell1.getNumber() === cell2.getNumber();
    }

    public static isNeighbor(cell1: Cell, cell2: Cell): boolean {
      return Math.abs(cell1.col - cell2.col) + Math.abs(cell1.row - cell2.row) === 1;
    }

    // has Third Neighbor in the Same Direction
    public static hasTNitSD(cell1: Cell, cell2: Cell, cells: Cell[]): boolean {
      if (cell1.col === cell2.col) {
        return cells.some((cell: Cell) =>
          cell.col === cell1.col &&
          (cell.row === (cell2.row * 2 - cell1.row) ||
            cell.row === (cell1.row * 2 - cell2.row)),
        );
      } else {
        return cells.some((cell: Cell) =>
          cell.row === cell1.row &&
          (cell.col === (cell2.col * 2 - cell1.col) ||
            cell.col === (cell1.col * 2 - cell2.col)),
        );
      }
    }

    public static isSatellite(cell1: Cell, cell2: Cell, distance: number = 1): boolean {
      return Math.abs(cell1.col - cell2.col) <= distance && Math.abs(cell1.row - cell2.row) <= distance;
    }

    private cellMatrix: CellMatrix;
    private model: Model;

    public async startup(useSnapshot: boolean = false) {
      this.model = Model.create(useSnapshot);
      this.traverse((cell: Cell, point) => {
        cell.setNumber(this.model.getNumberAt(point));
        if ( yyw.CONFIG.mode === "level") {
          const { limit: { ice = [], fix = [], nil = [] } } = Levels.current();
          const index = cell.getIndex();
          if (ice.indexOf(index) !== -1) {
            cell.setType(CELL_TYPES.ICE);
          } else if (fix.indexOf(index) !== -1) {
            cell.setType(CELL_TYPES.FIX);
          } else if (nil.indexOf(index) !== -1) {
            cell.setType(CELL_TYPES.NIL);
          } else {
            cell.setType(CELL_TYPES.DEF);
          }
        } else {
          cell.setType(CELL_TYPES.DEF);
        }
      });
    }

    public getSnapshot() {
      return this.model.getSnapshot();
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
      // 同步 model
      this.model.setNumberAt([cell.col, cell.row], num);
      return cell.setNumber(num);
    }

    public traverse(handler?: any, filter?: any) {
      return yyw.traverseMatrix(this.cellMatrix, handler, filter);
    }

    /**
     * 寻找可合并的数字链
     * @param preferredNum 优先合并的数字
     */
    public getChain(preferredNum: number): [number, Cell[]] {
      const numMap: { [num: string]: Cell[] } = {};
      // 先按数字序列化，以便于将长度不足的先剔除
      this.traverse((cell: Cell) => {
        const num = cell.getNumber();
        const key = `${num}`;
        if (!numMap[key]) {
          numMap[key] = [];
        }
        numMap[key].push(cell);
      });
      const entries = Object.entries(numMap);
      if (preferredNum) {
        // 指定的数字先检查
        entries.sort(([num]) => +num === preferredNum ? -1 : 1);
      }
      for (const [num, cells] of entries) {
        if (cells.length < 3) {
          continue;
        }
        const filteredCells = cells
        .filter((targetCell: Cell) => {
          return cells.some((cell: Cell) => {
            // 存在邻居的点
            return Cells.isNeighbor(targetCell, cell)
              // 存在两个同向邻居的点
              && Cells.hasTNitSD(targetCell, cell, cells);
            });
          });
        for (let i = 0; i < filteredCells.length; i++) {
          const neighbors = [filteredCells[i]];
          // 走 N-1 遍，避免漏网，比如 U 型结构
          for (let k = 0; k < filteredCells.length - 1; k++) {
            for (let j = 0; j < filteredCells.length; j++) {
              if (i !== j) {
                const cell = filteredCells[j];
                if (neighbors.indexOf(cell) === -1) {
                  // 跟链里的某一个相邻，就丢到链里
                  if (neighbors.some((n) => Cells.isNeighbor(cell, n))) {
                    neighbors.push(cell);
                  }
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
