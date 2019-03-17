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

    protected abstract onSwap(): void;

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
        // 起始单元格
        let fromCell: Cell;

        const handleBegin = (e: egret.TouchEvent, cancel: any) => {
          if (this.running) {
            cancel();
            return;
          }
          const { localX, localY } = e;
          fromCell = this.cells.getCellAt(this.xy2p([localX, localY]));
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
          const toCell = this.cells.getCellAt(this.xy2p([localX, localY]));
          // 不能拖入
          if (!toCell.canDrop()) {
            return;
          }
          // 非邻居，不处理
          if (!Cells.isNeighbor(fromCell, toCell)) {
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
          let collect: () => Promise<boolean>;
          if (fromCell.isMagic()) {
            if (toCell.isMagic()) {
              collect = async () => {
                return this.collectScreen(toCell, fromCell);
              };
            } else if (toCell.isBomb()) {
              collect = async () => {
                return this.collectSatellite(toCell, null, 2);
              };
            } else {
              collect = async () => {
                return this.collectSame(toCell, fromCell);
              };
            }
          } else if (fromCell.isBomb()) {
            if (toCell.isMagic()) {
              collect = async () => {
                return this.collectSatellite(fromCell, null, 2);
              };
            } else if (toCell.isBomb()) {
              collect = async () => {
                return this.collectSatellite(fromCell, toCell, 2);
              };
            } else {
              collect = async () => {
                return this.collectSatellite(fromCell, null);
              };
            }
          } else if (toCell.isMagic()) {
            collect = async () => {
              return this.collectSame(fromCell, toCell);
            };
          } else if (toCell.isBomb()) {
            collect = async () => {
              return this.collectSatellite(toCell, null);
            };
          } else if (!Cells.isSame(fromCell, toCell)) {
            // 不相同的普通水果
            collect = async () => {
              return this.collectChains(toCell, fromCell);
            };
          }
          if (collect) {
            this.resetCombo();
            const collected = await collect();
            // 如果不可消，换回原位
            if (collected) {
              this.onSwap();
              this.handleChange();
            } else {
              this.switchNumbers(fromCell, toCell);
            }
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
        case "shuffle":
          return this.doShuffle(confirm);
        default:
          return;
      }
    }

    protected ensureData(useSnapshot: boolean) {
      this.score = (useSnapshot && yyw.USER.arena[this.mode].score) || 0;
      this.increaseScore(0);
      this.combo = (useSnapshot && yyw.USER.arena[this.mode].combo) || 0;
      this.maxCombo = (useSnapshot && yyw.USER.arena[this.mode].maxCombo) || 0;
      this.handleChange();
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

    private handleChange() {
      const gameData = this.getGameData();
      // 发声
      if (gameData.combo >= 2) {
        const Sounds = [GoodSound, GreatSound, AmazingSound, ExcellentSound];
        Sounds[Math.min(3, gameData.combo - 2)].play();
      }
      yyw.emit("GAME_DATA", gameData);
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
        to.col - from.col,
        to.row - from.row,
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

    private async collectScreen(
      toCell?: Cell,
      fromCell?: Cell,
    ): Promise<boolean> {
      // 播放得分音效
      PointSound.play();
      const toNum = 0;
      // 同步消除
      // TODO 如果是冰冻，应该先消冰
      const cells = this.cells.traverse(
        undefined,
        (cell: Cell) => cell.getType() !== CELL_TYPES.NIL,
      );
      await Promise.all(
        cells.map((cell: Cell) => this.collectCell(cell)),
      );
      this.increaseScore((cells.length - 2) * 10);
      await this.dropCellsDown();
      await this.collectChains();
      return true;
    }

    private async collectSatellite(
      toCell: Cell,
      fromCell: Cell,
      distance: number = 1,
    ): Promise<boolean> {
      // 播放得分音效
      PointSound.play();
      // 同步消除
      // TODO 如果是冰冻，应该先消冰
      const cells = this.cells.traverse(
        undefined,
        (cell: Cell) =>
          cell.getType() !== CELL_TYPES.NIL
            // 消除 from/toCell 的“卫星”
            && (Cells.isSatellite(cell, toCell, distance)
              || (fromCell && Cells.isSatellite(cell, fromCell, distance))),
      );
      await Promise.all(
        cells.map((cell: Cell) => this.collectCell(cell)),
      );
      this.increaseScore((cells.length - 2) * 10);
      await this.dropCellsDown();
      await this.collectChains();
      return true;
    }

    private async collectSame(
      toCell: Cell,
      fromCell: Cell,
    ): Promise<boolean> {
      // 播放得分音效
      PointSound.play();
      // 同步消除
      // TODO 如果是冰冻，应该先消冰
      const num = toCell.getNumber();
      const cells = this.cells.traverse(
        undefined,
        (cell: Cell) => cell.getNumber() === num,
      );
      await Promise.all([
        ...cells.map((cell: Cell) => this.collectCell(cell)),
        this.collectCell(fromCell),
      ]);
      this.increaseScore((cells.length - 2) * 10);
      await this.dropCellsDown();
      await this.collectChains();
      return true;
    }

    /** 寻找可合并的数字链 */
    private async collectChains(
      triggerCell?: Cell,
      altTriggerCell?: Cell,
    ): Promise<boolean> {
      const preferredNum = triggerCell ? triggerCell.getNumber() : 0;
      const [num, cells] = this.cells.getChain(preferredNum);
      // 找到
      if (num) {
        const shape = Cells.shapeOf(cells);
        const index = cells.indexOf(triggerCell);
        const count = cells.length;

        let triggerCellNext: Cell;
        if (index !== -1) {
          // triggerCell 在合并链里
          cells.splice(index, 1);
          if (altTriggerCell) {
            // altTriggerCell 不在合并链里，才往下传
            if (cells.indexOf(altTriggerCell) === -1) {
              triggerCellNext = altTriggerCell;
            }
          }
        } else {
          // triggerCell 不在合并链里
          if (altTriggerCell) {
            const altIndex = cells.indexOf(altTriggerCell);
            if (altIndex !== -1) {
              cells.splice(altIndex, 1);
              triggerCellNext = triggerCell;
              triggerCell = altTriggerCell;
            } else {
              triggerCell = cells.shift();
            }
          } else {
            triggerCell = cells.shift();
          }
        }
        triggerCell.setType(shape);
        // 播放得分音效
        PointSound.play();
        const toNum = shape === CELL_TYPES.MAGIC
          ? MAGIC_NUMBER : shape === CELL_TYPES.BOMB
          ? BOMB_NUMBER : 0;
        // 同步消除
        await Promise.all([
          ...cells.map((cell) => this.collectCell(cell, 0)),
          this.collectCell(triggerCell, toNum),
        ]);
        this.increaseScore((count - 2) * 10);
        yyw.emit("NUM_COLLECTED", { num, count });
        await this.dropCellsDown();
        this.increaseCombo();
        // 继续找，优先消除交换点
        await this.collectChains(triggerCellNext);
      }

      return !!num;
    }

    private async collectCell(cell: Cell, num: number = 0) {
      await cell.fadeOut();
      yyw.emit("NUM_COLLECTED", {
        num: cell.getNumber(),
        count: 1,
      });
      this.cells.setNumberAt(cell, num);
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
              // 不可用
              if (numAbove === NIL_NUMBER) {
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
      // 因为 traverse 是反向广度优先遍历，所以此处需要反转
      const cells = this.cells.traverse(
        undefined,
        (cell: Cell) => cell.getType() !== CELL_TYPES.NIL,
      ).reverse();
      const numbers = cells.map((cell: Cell) => cell.getNumber());
      // 再遍历重新设置
      cells.forEach((cell: Cell) => {
        const index = yyw.random(numbers.length);
        const [ num ] = numbers.splice(index, 1);
        this.cells.setNumberAt(cell, num);
      });

      await yyw.twirlIn(this.main, 200);

      this.resetCombo();
      const collected = await this.collectChains();
      if (collected) {
        this.handleChange();
      }
      this.isRunning = false;
    }
  }
}
