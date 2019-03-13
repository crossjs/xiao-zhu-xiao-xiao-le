namespace game {
  export abstract class ArenaBase extends yyw.Base {
    protected abstract mode: string = "";
    protected tfdScore: eui.BitmapLabel;
    protected cells: Cells;
    /** 是否正在执行（动画等） */
    protected running: boolean = false;
    /** 连击数 */
    protected score: number = 0;
    protected combo: number = 0;
    protected maxCombo: number = 0;
    private offToolUsing: () => void;
    private offDnd: () => void;

    public get isRunning() {
      return this.running;
    }

    public set isRunning(running: boolean) {
      this.running = running;
      yyw.emit("ARENA_RUN", running);
    }

    public async startup(useSnapshot: boolean = false) {
      this.cells.startup(useSnapshot);
      this.ensureData(useSnapshot);
    }

    public getSnapshot() {
      const { score, combo, maxCombo } = this;
      return {
        score,
        combo,
        maxCombo,
        ...this.cells.getSnapshot(),
      };
    }

    protected abstract onSwap(hasChain: boolean): void;

    protected destroy() {
      this.removeListeners();
      this.resetCells();
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      this.addListeners();
    }

    protected addListeners() {
      if (!this.offToolUsing) {
        this.offToolUsing = yyw.on("TOOL_USING", this.onToolUsing, this);
      }

      if (!this.offDnd) {
        // 起始点
        let fromXY: [number, number];
        // 起始单元格
        let fromCell: Cell;

        const handleBegin = (e: egret.TouchEvent, cancel: any) => {
          if (this.running) {
            cancel();
            return;
          }
          const { localX, localY } = e;
          fromXY = [localX, localY];
          fromCell = this.cells.getCellAt(this.xy2p(fromXY));
          // 不能拖动
          if (!fromCell.canDrag()) {
            cancel();
            return;
          }
          fromCell.zoomIn();
          yyw.setZIndex(fromCell);
        };

        const handleDrag = async (e: egret.TouchEvent, cancel: any) => {
          const { localX, localY } = e;
          const toXY: [number, number] = [localX, localY];
          const toCell = this.cells.getCellAt(this.xy2p(toXY));
          // 不能拖入
          if (!toCell.canDrop()) {
            return;
          }
          // 非邻居，不处理
          if (!Cells.isNeighborCells(fromCell, toCell)) {
            return;
          }
          const slope = getSlope(toXY, fromXY);
          if (slope < 2 && slope > 0.5) {
            return;
          }
          // 开始交换
          cancel();
          fromCell.zoomOut();
          this.isRunning = true;
          // 普通交换
          SwapSound.play();
          this.tweenFromTo(fromCell, toCell, 300);
          await this.tweenFromTo(toCell, fromCell, 300);
          this.switchNumbers(fromCell, toCell);
          const numFrom = fromCell.getNumber();
          const numTo = toCell.getNumber();
          if (numFrom !== numTo) {
            let magicCell: Cell;
            let numToGrowUp: number;
            if (numFrom === MAGIC_NUMBER) {
              magicCell = fromCell;
              numToGrowUp = numTo;
            } else if (numTo === MAGIC_NUMBER) {
              magicCell = toCell;
              numToGrowUp = numFrom;
            }
            if (magicCell) {
              // 魔法效果
              MagicSound.play();
              await this.growUpCellsOf(numToGrowUp);
              this.cells.setNumberAt(magicCell, 0);
              await this.dropCellsDown();
            }
            this.resetCombo();
            const hasChain = await this.mergeChains(toCell, fromCell);
            this.onSwap(hasChain);
            this.handleChange(hasChain);
          }
          this.isRunning = false;
        };

        const handleEnd = () => {
          if (this.running) {
            return;
          }
          fromCell.zoomOut();
        };

        this.offDnd = yyw.onDnd(
          this.main,
          handleBegin,
          handleDrag,
          handleEnd,
          this.main.stage,
        );
      }
    }

    protected removeListeners() {
      if (this.offToolUsing) {
        this.offToolUsing();
        this.offToolUsing = null;
      }
      if (this.offDnd) {
        this.offDnd();
        this.offDnd = null;
      }
    }

    protected onToolUsing({
      data: { type, targetX, targetY, confirm, cancel },
    }: egret.Event) {
      switch (type) {
        case "valueUp":
          if (cancel) {
            return this.preValueUp(targetX, targetY, cancel);
          }
          return this.doValueUp(targetX, targetY, confirm);
        case "shuffle":
          return this.doShuffle(confirm);
        case "breaker":
          if (cancel) {
            return this.preBreaker(targetX, targetY, cancel);
          }
          return this.doBreaker(targetX, targetY, confirm);
        default:
          return;
      }
    }

    protected ensureData(useSnapshot: boolean) {
      this.score = (useSnapshot && yyw.USER.arena[this.mode].score) || 0;
      this.increaseScore(0);
      this.combo = (useSnapshot && yyw.USER.arena[this.mode].combo) || 0;
      this.maxCombo = (useSnapshot && yyw.USER.arena[this.mode].maxCombo) || 0;
      this.handleChange(true);
    }

    protected getGameData() {
      return {
        score: this.score,
        combo: this.combo,
        maxCombo: this.maxCombo,
      };
    }

    /**
     * 更新分数
     */
    protected increaseScore(n: number) {
      this.score += n;
      this.flashScore();
    }

    private resetCells() {
      this.cells.traverse((cell: Cell) => {
        cell.reset();
      });
    }

    private resetCellsZoom() {
      this.cells.traverse((cell: Cell) => {
        cell.zoomOut();
      });
    }

    private xy2p([x, y]: number[]): Point {
      return [
        Math.max(
          0,
          Math.min(COLS - 1, Math.floor((x / this.main.width) * COLS)),
        ),
        Math.max(
          0,
          Math.min(ROWS - 1, Math.floor((y / this.main.height) * ROWS)),
        ),
      ];
    }

    @yyw.debounce()
    private async flashScore() {
      const tween = yyw.getTween(this.tfdScore);
      await tween.to({ scale: 1.5 });
      this.tfdScore.text = yyw.zeroPadding(`${this.score}`, 5);
      await tween.to({ scale: 1 });
    }

    private handleChange(hasMutations: boolean) {
      if (hasMutations) {
        const gameData = this.getGameData();
        // 发声
        if (gameData.combo > 2) {
          // 3 -> 0; 4,5 -> 1; 6,7 -> 2; 8,9,10,... -> 3
          const Sounds = [GoodSound, GreatSound, AmazingSound, ExcellentSound];
          Sounds[Math.min(3, Math.floor((gameData.combo - 2) / 2))].play();
        }
        yyw.emit("GAME_DATA", gameData);
      }
    }

    private async growUpCellsOf(num: number) {
      const cells: Cell[] = this.getCellsOf(num++);
      if (num > BIGGEST_NUMBER) {
        num = MAGIC_NUMBER;
      }
      await Promise.all(
        cells.map(async (cell) => {
          await cell.tweenUp();
          return this.cells.setNumberAt(cell, num);
        }),
      );
    }

    private getCellsOf(num: number): Cell[] {
      const matchedCells: Cell[] = [];
      this.cells.traverse((cell: Cell) => {
        if (cell.getNumber() === num) {
          matchedCells.push(cell);
        }
      });
      return matchedCells;
    }

    private switchNumbers(from: Cell, to: Cell): void {
      const numFrom = from.getNumber();
      const numTo = to.getNumber();
      this.cells.setNumberAt(from, numTo);
      this.cells.setNumberAt(to, numFrom);
    }

    private tweenFromTo(
      from: Cell,
      to: Cell,
      duration: number = 100,
    ): Promise<void> {
      return from.tweenTo(
        [
          {
            x: to.col - from.col,
            y: to.row - from.row,
          },
        ],
        duration,
      );
    }

    private resetCombo() {
      this.combo = 0;
      this.maxCombo = 0;
    }

    private increaseCombo() {
      this.combo++;
      this.maxCombo = Math.max(this.combo, this.maxCombo);
    }

    /** 寻找可合并的数字链 */
    private async mergeChains(
      triggerCell?: Cell,
      triggerCell2?: Cell,
    ): Promise<boolean> {
      const firstNumber = triggerCell ? triggerCell.getNumber() : 0;
      const [num, cells] = this.cells.getChain(
        firstNumber === MAGIC_NUMBER ? 0 : firstNumber,
      );
      // 找到
      if (num) {
        const isSF = Cells.isStraightFive(cells);
        let triggerCellNext: Cell;
        if (!triggerCell) {
          triggerCell = cells.shift();
        } else {
          let index = Cells.getIndexOf(cells, triggerCell);
          // triggerCell 在合并链里
          if (index !== -1) {
            cells.splice(index, 1);
            if (triggerCell2) {
              index = Cells.getIndexOf(cells, triggerCell2);
              // triggerCell2 不在合并链里，才往下传
              if (index === -1) {
                triggerCellNext = triggerCell2;
              }
            }
          } else {
            if (triggerCell2) {
              index = Cells.getIndexOf(cells, triggerCell2);
              if (index !== -1) {
                triggerCellNext = triggerCell;
                triggerCell = triggerCell2;
                cells.splice(index, 1);
              } else {
                triggerCell = cells.shift();
              }
            } else {
              triggerCell = cells.shift();
            }
          }
        }
        // 播放得分音效
        PointSound.play();
        const toNum = isSF || num >= BIGGEST_NUMBER ? MAGIC_NUMBER : +num + 1;
        // 同步合并
        await Promise.all([
          ...cells.map((cell) => {
            const steps = Cells.getSteps(
              cell,
              triggerCell,
              cells.filter((c) => !Cells.isEqual(c, cell)),
            );
            return this.collapseCellBySteps(cell, steps);
          }),
          triggerCell.growUp(toNum),
        ]);
        yyw.emit("NUM_MERGED", { num: toNum });
        await this.dropCellsDown();
        this.increaseCombo();
        // 继续找，优先消除交换点
        await this.mergeChains(triggerCellNext);
      }

      return !!num;
    }

    private async dropCellsDown() {
      const { cells } = this;
      for (let col = 0; col < COLS; col++) {
        let row = ROWS;
        while (row-- > 0) {
          const point: Point = [col, row];
          const num = cells.getNumberAt(point);
          if (num === 0) {
            if (row === 0) {
              cells.setNumberAt(point);
            } else {
              let rowAbove = row;
              let numAbove: number;
              let pointAbove: Point;
              while (!numAbove && rowAbove--) {
                pointAbove = [col, rowAbove];
                numAbove = cells.getNumberAt(pointAbove);
              }
              if (numAbove === -1) {
                cells.setNumberAt(point);
              } else {
                if (!numAbove) {
                  pointAbove = [col, 0];
                  cells.setNumberAt(pointAbove);
                }
                const cellAbove = this.cells.getCellAt(pointAbove);
                const cell = this.cells.getCellAt(point);
                await this.tweenFromTo(cellAbove, cell, 50);
                this.switchNumbers(cellAbove, cell);
              }
            }
          }
        }
      }
    }

    private async collapseCellBySteps(from: Cell, steps: Cell[]) {
      let current = from;
      const increases = [];
      const length = steps.length;
      for (let i = 0; i < length; i++) {
        const step = steps[i];
        // 位移
        increases.push({
          x: step.col - current.col,
          y: step.row - current.row,
        });
        current = step;
      }
      // 旋转
      increases.push({
        rotation: 1080,
        alpha: -1,
      });
      from.flashScore();
      this.increaseScore(from.getNumber() * 10);
      await from.tweenTo(increases, 500, () => {
        this.cells.setNumberAt(from, 0);
      });
    }

    /**
     * 指定单元格数字+1
     */
    private preValueUp(x: number, y: number, cancel: any): void {
      if (this.isRunning) {
        cancel();
        return;
      }
      this.resetCellsZoom();
      if (x === undefined || y === undefined) {
        cancel();
        return;
      }
      this.cells.getCellAt(this.xy2p([x, y])).zoomIn();
    }

    /**
     * 指定单元格数字+1
     */
    private async doValueUp(x: number, y: number, confirm: any): Promise<void> {
      if (this.isRunning) {
        return;
      }
      // 确定消费
      confirm();
      this.resetCells();
      const cell = this.cells.getCellAt(this.xy2p([x, y]));
      // 开始工作
      this.isRunning = true;
      await cell.growUp();
      cell.zoomOut();

      this.resetCombo();
      const hasChain = await this.mergeChains(cell);
      this.isRunning = false;
      this.handleChange(hasChain);
    }

    /**
     * 随机重排
     */
    private async doShuffle(confirm: any): Promise<void> {
      // 确定消费
      confirm();
      // 开始工作
      this.isRunning = true;
      await yyw.twirlOut(this.main, 300);

      // 先取得一个拍平的
      const flattenedCells = this.cells.flatten().filter((cell: Cell) => {
        return cell.getType() !== CELL_TYPES.BLACK;
      });
      // 再遍历重新设置
      this.cells.traverse((cell: Cell, point) => {
        if (cell.getType() !== CELL_TYPES.BLACK) {
          const index = yyw.random(flattenedCells.length);
          const toCell = flattenedCells.splice(index, 1)[0];
          this.cells.setNumberAt(cell, toCell.getNumber());
        }
      });

      await yyw.twirlIn(this.main, 200);

      this.resetCombo();
      const hasChain = await this.mergeChains();
      this.isRunning = false;
      this.handleChange(hasChain);
    }

    /**
     * 销毁指定单元格
     */
    private preBreaker(x: number, y: number, cancel: any): void {
      if (this.isRunning) {
        cancel();
        return;
      }
      this.resetCellsZoom();
      if (x === undefined || y === undefined) {
        cancel();
        return;
      }
      const cell = this.cells.getCellAt(this.xy2p([x, y]));
      cell.zoomIn();
    }

    /**
     * 销毁指定单元格
     */
    private async doBreaker(x: number, y: number, confirm: any): Promise<void> {
      if (this.isRunning) {
        return;
      }
      // 确定消费
      confirm();
      this.resetCells();
      const cell = this.cells.getCellAt(this.xy2p([x, y]));
      // 开始工作
      this.isRunning = true;
      await cell.fadeOut();
      this.cells.setNumberAt(cell, 0);

      await this.dropCellsDown();
      cell.fadeIn();

      this.resetCombo();
      const hasChain = await this.mergeChains(cell);
      this.isRunning = false;
      this.handleChange(hasChain);
    }
  }

  /**
   * A、B 两点连线的斜率
   * @param point1 点 A
   * @param point2 点 B
   */
  function getSlope(point1: Point, point2: Point): number {
    const dx = Math.abs(point1[0] - point2[0]);
    const dy = Math.abs(point1[1] - point2[1]);
    return dx === 0 ? Number.MAX_SAFE_INTEGER : dy / dx;
  }
}
