namespace game {
  export abstract class ArenaBase extends yyw.Base {
    protected abstract mode: string = "";
    protected tfdScore: eui.BitmapLabel;
    /** 是否正在执行（动画等） */
    protected running: boolean = false;
    /** 连击数 */
    protected score: number = 0;
    protected combo: number = 0;
    protected maxCombo: number = 0;
    protected cellWidth: number = 144;
    protected cellHeight: number = 144;
    protected model: Model;
    protected cells: Cell[][];
    protected cols: number = 5;
    protected rows: number = 5;

    public get isRunning() {
      return this.running;
    }

    public set isRunning(running: boolean) {
      this.running = running;
      yyw.emit("ARENA_RUN", running);
    }

    public async startup(useSnapshot: boolean = false) {
      this.model = Model.create(useSnapshot);
      if (!this.cells) {
        await this.createCells();
      }
      yyw.traverseMatrix(this.cells, (cell: Cell, col: number, row: number) => {
        cell.setNumber(this.model.getNumberAt([col, row]));
      });
      this.ensureData(useSnapshot);
    }

    public getSnapshot() {
      const { score, combo, maxCombo } = this;
      return {
        score, combo, maxCombo,
        ...this.model.getSnapshot(),
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

      if (fromChildrenCreated) {
        yyw.on("TOOL_USING", this.onToolUsing, this);
        this.initDnd();
      }

      this.addListeners();
    }

    protected addListeners() {
      //
    }

    protected removeListeners() {
      //
    }

    protected onToolUsing({ data: {
      type,
      targetX,
      targetY,
      confirm,
      cancel,
    }}: egret.Event) {
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
      this.score = useSnapshot && yyw.USER.arena![this.mode]!.score || 0;
      this.increaseScore(0);
      this.combo = useSnapshot && yyw.USER.arena![this.mode]!.combo || 0;
      this.maxCombo = useSnapshot && yyw.USER.arena![this.mode]!.maxCombo || 0;
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
      yyw.traverseMatrix(this.cells, (cell: Cell) => {
        cell.reset();
      });
    }

    private resetCellsZoom() {
      yyw.traverseMatrix(this.cells, (cell: Cell) => {
        cell.zoomOut();
      });
    }

    private createCells(): void {
      const { cellWidth, cellHeight, cols, rows, main } = this;
      const cells = this.cells = [];
      for (let row = 0; row < rows; row++) {
        const r = cells[row] = [];
        for (let col = 0; col < cols; col++) {
          main.addChild(
            r[col] = new Cell(col, row, cellWidth, cellHeight),
          );
        }
      }
    }

    private x2p(x: number): number {
      return Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.cellWidth)));
    }

    private y2p(y: number): number {
      return Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.cellHeight)));
    }

    private initDnd() {
      const { main } = this;

      // 起始点
      let fromXY: [number, number];
      // 起始单元格
      let fromPoint: Point;

      const handleBegin = (e: egret.TouchEvent, cancel: any) => {
        if (this.running) {
          cancel();
          return;
        }
        const { localX, localY } = e;
        fromXY = [localX, localY];
        fromPoint = [
          this.x2p(localX),
          this.y2p(localY),
        ];
        const cell = this.getCellAt(fromPoint);
        cell.zoomIn();
        yyw.setZIndex(cell);
      };

      const handleDrag = async (e: egret.TouchEvent, cancel: any) => {
        const { localX, localY } = e;
        const toPoint: Point = [
          this.x2p(localX),
          this.y2p(localY),
        ];
        // 非邻居，不处理
        if (!isNeighbor(fromPoint, toPoint)) {
          return;
        }
        const toXY: [number, number] = [localX, localY];
        const slope = getSlope(toXY, fromXY);
        if (slope < 2 && slope > 0.5) {
          return;
        }
        cancel();
        const cell = this.getCellAt(fromPoint);
        cell.zoomOut();
        this.isRunning = true;
        // 普通交换
        SwapSound.play();
        this.tweenFromTo(fromPoint, toPoint, 300);
        await this.tweenFromTo(toPoint, fromPoint, 300);
        this.switchNumbers(fromPoint, toPoint);
        const numFrom = this.model.getNumberAt(fromPoint);
        const numTo = this.model.getNumberAt(toPoint);
        if (numFrom !== numTo) {
          let magicPoint: Point;
          let numToGrowUp: number;
          if (numFrom === MAGIC_NUMBER) {
            magicPoint = fromPoint;
            numToGrowUp = numTo;
          } else if (numTo === MAGIC_NUMBER) {
            magicPoint = toPoint;
            numToGrowUp = numFrom;
          }
          if (magicPoint) {
            // 魔法效果
            MagicSound.play();
            await this.growUpCellsOf(numToGrowUp);
            this.setCellNumber(magicPoint, 0);
            await this.dropCellsDown();
          }
          this.resetCombo();
          const hasChain = await this.mergeChains(toPoint, fromPoint);
          this.onSwap(hasChain);
          this.handleChange(hasChain);
        }
        this.isRunning = false;
      };

      const handleEnd = () => {
        if (this.running) {
          return;
        }
        this.getCellAt(fromPoint).zoomOut();
      };

      yyw.onDnd(main, handleBegin, handleDrag, handleEnd, main.stage);
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
      const points: Point[] = this.getPointsOf(num++);
      if (num > BIGGEST_NUMBER) {
        num = MAGIC_NUMBER;
      }
      await Promise.all(
        points.map(async (point) => {
          await this.getCellAt(point).tweenUp();
          return this.setCellNumber(point, num);
        }),
      );
    }

    private getPointsOf(num: number): Point[] {
      const matchedPoints: Point[] = [];
      const { model, cols, rows } = this;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const point: Point = [col, row];
          if (model.getNumberAt(point) === num) {
            matchedPoints.push(point);
          }
        }
      }
      return matchedPoints;
    }

    private switchNumbers(from: Point, to: Point): void {
      const { model } = this;
      const numFrom = model.getNumberAt(from);
      const numTo = model.getNumberAt(to);
      this.setCellNumber(from, numTo);
      this.setCellNumber(to, numFrom);
    }

    private tweenFromTo(from: Point, to: Point, duration: number = 100): Promise<void> {
      return this.getCellAt(from).tweenTo([{
        x: (to[0] - from[0]) * this.cellWidth,
        y: (to[1] - from[1]) * this.cellHeight,
      }], duration);
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
      triggerPoint?: Point,
      triggerPoint2?: Point,
    ): Promise<boolean> {
      const { model } = this;
      const firstNumber = triggerPoint ? model.getNumberAt(triggerPoint) : 0;
      const [ num, points ] = model.getChain(firstNumber === MAGIC_NUMBER ? 0 : firstNumber);
      // 找到
      if (num) {
        const isSF = isStraightFive(points);
        let triggerPointNext: Point;
        if (!triggerPoint) {
          triggerPoint = points.shift();
        } else {
          let index = getIndexOf(points, triggerPoint);
          // triggerPoint 在合并链里
          if (index !== -1) {
            points.splice(index, 1);
            if (triggerPoint2) {
              index = getIndexOf(points, triggerPoint2);
              // triggerPoint2 不在合并链里，才往下传
              if (index === -1) {
                triggerPointNext = triggerPoint2;
              }
            }
          } else {
            if (triggerPoint2) {
              index = getIndexOf(points, triggerPoint2);
              if (index !== -1) {
                triggerPointNext = triggerPoint;
                triggerPoint = triggerPoint2;
                points.splice(index, 1);
              } else {
                triggerPoint = points.shift();
              }
            } else {
              triggerPoint = points.shift();
            }
          }
        }
        // 播放得分音效
        PointSound.play();
        const toNum = (isSF || num >= BIGGEST_NUMBER) ? MAGIC_NUMBER : (+num + 1);
        // 同步合并
        await Promise.all(
          [
            ...points.map((point) => {
              const steps = getSteps(
                point,
                triggerPoint,
                points.filter((p) => !isEqual(p, point)),
              );
              return this.collapseCellBySteps(point, steps);
            }),
            this.growUpCellAt(triggerPoint, toNum),
          ],
        );
        yyw.emit("NUM_MERGED", { num: toNum });
        await this.dropCellsDown();
        this.increaseCombo();
        // 继续找，优先消除交换点
        await this.mergeChains(triggerPointNext);
      }

      return !!num;
    }

    private async dropCellsDown() {
      const { model, cols, rows } = this;
      for (let col = 0; col < cols; col++) {
        let row = rows;
        while (row-- > 0) {
          const point: Point = [col, row];
          const num = model.getNumberAt(point);
          if (num === 0) {
            if (row === 0) {
              this.setCellNumber(point);
            } else {
              let rowAbove = row;
              let numAbove: number;
              let pointAbove: Point;
              while (!numAbove && rowAbove--) {
                pointAbove = [col, rowAbove];
                numAbove = model.getNumberAt(pointAbove);
              }
              if (!numAbove) {
                pointAbove = [col, 0];
                this.setCellNumber(pointAbove);
              }
              await this.tweenFromTo(pointAbove, point, 50);
              this.switchNumbers(pointAbove, point);
            }
          }
        }
      }
    }

    private async growUpCellAt(point: Point, num?: number) {
      const cell = this.getCellAt(point);
      // 从 +1 道具来
      if (num === undefined) {
        num = cell.getNumber() + 1;
        if (num > BIGGEST_NUMBER) {
          num = MAGIC_NUMBER;
        }
      }
      await cell.fadeOut();
      this.setCellNumber(point, num);
      await cell.fadeIn();
    }

    private async collapseCellBySteps(
      from: Point,
      steps: Point[],
    ) {
      let current = from;
      const increases = [];
      const length = steps.length;
      for (let i = 0; i < length; i++) {
        const step = steps[i];
        // 位移
        increases.push({
          x: (step[0] - current[0]) * this.cellWidth,
          y: (step[1] - current[1]) * this.cellHeight,
        });
        current = step;
      }
      // 旋转
      increases.push({
        rotation: 1080,
        alpha: -1,
      });
      const cell = this.getCellAt(from);
      cell.flashScore();
      this.increaseScore(cell.getNumber() * 10);
      await cell.tweenTo(increases, 500, () => {
        this.setCellNumber(from, 0);
      });
    }

    private getCellAt(point: Point): Cell {
      return this.cells[point[1]][point[0]];
    }

    private setCellNumber(point: Point, num?: number) {
      // 先更新模型
      this.model.setNumberAt(point, num);
      if (num === undefined) {
        num = this.model.getNumberAt(point);
      }
      // 再设置 UI
      this.getCellAt(point).setNumber(num);
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
      const cell = this.getCellAt([
        this.x2p(x),
        this.y2p(y),
      ]);
      cell.zoomIn();
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
      const point: [number, number] = [
        this.x2p(x),
        this.y2p(y),
      ];
      // 开始工作
      this.isRunning = true;
      await this.growUpCellAt(point);
      this.getCellAt(point).zoomOut();

      this.resetCombo();
      const hasChain = await this.mergeChains(point);
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

      const matrix = this.model.getMatrix();
      // 先取得一个拍平的
      const flattenedMatrix = yyw.flattenMatrix(matrix);
      // 再遍历重新设置
      yyw.traverseMatrix(matrix, (num: number, col: number, row: number) => {
        const index = yyw.random(flattenedMatrix.length);
        this.setCellNumber([col, row], flattenedMatrix.splice(index, 1)[0]);
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
      const cell = this.getCellAt([
        this.x2p(x),
        this.y2p(y),
      ]);
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
      const point: [number, number] = [
        this.x2p(x),
        this.y2p(y),
      ];
      // 开始工作
      this.isRunning = true;
      const cell = this.getCellAt(point);
      await cell.fadeOut();
      this.setCellNumber(point, 0);
      await this.dropCellsDown();
      cell.fadeIn();

      this.resetCombo();
      const hasChain = await this.mergeChains(point);
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

  /** 是否存在 5 个在一条线上 */
  function isStraightFive(points: Point[]): boolean {
    const map = {};
    for (const [x, y] of points) {
      const keyX = `x${x}`;
      const keyY = `y${y}`;
      if (!map[keyX]) {
        map[keyX] = 0;
      }
      map[keyX] += 1;
      if (!map[keyY]) {
        map[keyY] = 0;
      }
      map[keyY] += 1;
    }
    return Object.values(map).some((v) => v >= 5);
  }
}
