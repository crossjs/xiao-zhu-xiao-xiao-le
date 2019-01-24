namespace game {
  const SNAPSHOT_KEY = "YYW_G4_ARENA";

  export class Arena extends yyw.Base {
    public static async fromSnapshot(): Promise<Arena> {
      const { lives, score, combo } = await yyw.getStorage(SNAPSHOT_KEY);
      const arena = new Arena(true, { lives, score, combo });
      return arena;
    }

    private isGameOver: boolean = false;
    private useSnapshot: boolean = false;
    private dataToSync: any;
    private main: eui.Group;
    private sndSwitch: SwapSound;
    private sndMagic: MagicSound;
    private sndPoint: PointSound;
    // private b1: eui.Image;
    // private b2: eui.Image;
    // private b3: eui.Image;
    // private b4: eui.Image;
    // private b5: eui.Image;
    private cellWidth: number = 144;
    private cellHeight: number = 144;
    private cols: number = 5;
    private rows: number = 5;
    private maxNum: number = 5;
    private model: Model;
    private cells: Cell[][];
    /** 可用的剩余步数 */
    private lives: number = 5;
    private score: number = 0;
    /** 连击数 */
    private combo: number = 0;
    private level: number = 0;
    /** 是否正在执行（动画等） */
    private running: boolean = false;

    public constructor(useSnapshot: boolean = false, data?: any) {
      super();
      this.useSnapshot = useSnapshot;
      this.sndSwitch = new SwapSound();
      this.sndMagic = new MagicSound();
      this.sndPoint = new PointSound();
      this.dataToSync = data;
    }

    public get isRunning() {
      return this.running;
    }

    public set isRunning(running: boolean) {
      this.running = running;
      this.dispatchEventWith("STATE_CHANGE", false, {
        running,
      });
    }

    /**
     * 体力满格
     */
    public get isLivesFull(): boolean {
      return this.lives >= 5;
    }

    public restart() {
      this.createModel();
      this.syncData();
      const { model } = this;
      yyw.eachMatrix(this.cells, (cell: Cell, col: number, row: number) => {
        cell.setNumber(model.getNumberAt([col, row]));
      });
    }

    /**
     * 指定单元格数字+1
     */
    public preValueUp(x: number, y: number, cancel: any): void {
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
    public async doValueUp(x: number, y: number, confirm: any): Promise<void> {
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
      await this.mergeChains(point);
      this.isRunning = false;
      this.notify();
    }

    /**
     * 随机重排
     */
    public async doShuffle(confirm: any): Promise<void> {
      // 确定消费
      confirm();
      // 开始工作
      this.isRunning = true;
      await yyw.twirlOut(this.main, 300);

      this.model.doShuffle();
      this.updateView();

      await yyw.twirlIn(this.main, 200);

      await this.mergeChains();
      this.isRunning = false;
      this.notify();
    }

    /**
     * 销毁指定单元格
     */
    public preBreaker(x: number, y: number, cancel: any): void {
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
    public async doBreaker(x: number, y: number, confirm: any): Promise<void> {
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
      await this.mergeChains(point);
      this.isRunning = false;
      this.notify();
    }

    /**
     * 增加体力
     */
    public doLivesUp(confirm: any): void {
      // 确定消费
      confirm();
      // 开始工作
      this.increaseLives(1);
    }

    protected destroy() {
      this.setSnapshot(this.isGameOver ? null : undefined);
      this.resetCells();
      yyw.eachMatrix(this.cells, yyw.removeFromStage);
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      this.isGameOver = false;
      await this.createModel();
      this.syncData(this.dataToSync);
      this.createCellsView();
      if (fromChildrenCreated) {
        this.initTouchHandlers();
        this.initialized = true;
      }
    }

    /**
     * 更新剩余步骤及其显示
     */
    private increaseLives(n: number) {
      this.lives = Math.max(0, Math.min(5, this.lives + n));
      for (let step = 1; step <= 5; step++) {
        this[`b${step}`].visible = step <= this.lives;
      }
      if (n < 0) {
        if (this.lives === 1) {
          this.dispatchEventWith("LIVES_LOW");
        }
      }
    }

    private syncData({
      lives = 5, score = 0, combo = 0,
    }: any = {}) {
      this.lives = lives;
      this.increaseLives(0);
      this.score = score;
      this.increaseScore(0);
      this.combo = combo;
      this.notify();
    }

    private resetCells() {
      yyw.eachMatrix(this.cells, (cell: Cell) => {
        cell.reset();
      });
    }

    private resetCellsZoom() {
      yyw.eachMatrix(this.cells, (cell: Cell) => {
        cell.zoomOut();
      });
    }

    private setSnapshot(value?: any) {
      this.model.setSnapshot(value);
      if (value === null) {
        yyw.setStorage(SNAPSHOT_KEY, null);
      } else {
        const { lives, score, combo } = this;
        yyw.setStorage(SNAPSHOT_KEY, {
          lives, score, combo,
        });
      }
    }

    private async createModel(): Promise<void> {
      this.model = this.useSnapshot
        ? await Model.fromSnapshot()
        : new Model(this.cols, this.rows, this.maxNum);
    }

    private createCellsView(): void {
      const { model, cellWidth, cellHeight, cols, rows, main } = this;
      const numbers = model.geNumbers();
      const cells = this.cells = [];
      for (let row = 0; row < rows; row++) {
        const r = cells[row] = [];
        for (let col = 0; col < cols; col++) {
          main.addChild(
            r[col] = new Cell(col, row, cellWidth, cellHeight, numbers[row][col]),
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

    private initTouchHandlers() {
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
        this.getCellAt(fromPoint).zoomIn();
      };

      const handleDrag = async (e: egret.TouchEvent, cancel: any) => {
        const { localX, localY } = e;
        const toPoint: Point = [
          this.x2p(localX),
          this.y2p(localY),
        ];
        // 角度太模棱两可的，不处理
        if (!isNeighbor(fromPoint, toPoint)) {
          return;
        }
        const toXY: [number, number] = [localX, localY];
        const slope = getSlope(toXY, fromXY);
        if (slope < 2 && slope > 0.5) {
          return;
        }
        cancel();
        this.getCellAt(fromPoint).zoomOut();
        this.isRunning = true;
        // 普通交换
        this.sndSwitch.play();
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
            this.sndMagic.play();
            await this.growUpCellsOf(numToGrowUp);
            this.setCellNumber(magicPoint, 0);
            await this.dropCellsDown();
          }
          this.resetCombo();
          const hasChain = await this.mergeChains(toPoint, fromPoint);
          if (!hasChain) {
            this.increaseLives(-1);
            if (this.lives === 0) {
              this.setGameOver();
            }
          }
        }
        this.isRunning = false;
        this.notify();
      };

      const handleEnd = (e: egret.TouchEvent, cancel: any) => {
        if (this.running) {
          return;
        }
        this.getCellAt(fromPoint).zoomOut();
      };

      yyw.onDnd(main, handleBegin, handleDrag, handleEnd, true);
    }

    private setGameOver() {
      this.isGameOver = true;
      this.isRunning = false;
      this.setSnapshot(null);
      this.dispatchEventWith("GAME_OVER", false, {
        score: this.score,
        level: this.level,
        combo: this.combo,
      });
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
      // 发红包
      if (num === MAGIC_NUMBER) {
        this.dispatchEventWith("MAGIC_GOT");
      }
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

    /**
     * 更新分数
     */
    private increaseScore(n: number) {
      this.score += n;
      this.level = Math.ceil(this.score / 3000);
      this.model.setLevel(this.level);
    }

    @yyw.debounce()
    private notify() {
      this.dispatchEventWith("DATA_CHANGE", false, {
        score: this.score,
        level: this.level,
        combo: this.combo,
        lives: this.lives,
      });
    }

    private switchNumbers(from: Point, to: Point): void {
      const { model } = this;
      const numFrom = model.getNumberAt(from);
      const numTo = model.getNumberAt(to);
      this.setCellNumber(from, numTo);
      this.setCellNumber(to, numFrom);
    }

    private tweenFromTo(from: Point, to: Point, duration: number = 100, onResolve?: any): Promise<void> {
      return this.getCellAt(from).tweenTo([{
        x: (to[0] - from[0]) * this.cellWidth,
        y: (to[1] - from[1]) * this.cellHeight,
      }], duration, onResolve);
    }

    private resetCombo() {
      this.combo = 0;
    }

    private increaseCombo() {
      this.combo++;
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
        this.increaseCombo();
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
        this.sndPoint.play();
        // 同步合并
        await Promise.all(
          [...points.map((point) => {
            const lives = getSteps(
              point,
              triggerPoint,
              points.filter((p) => !isEqual(p, point)),
            );
            return this.collapseCellBySteps(point, lives);
          }), this.growUpCellAt(triggerPoint, isSF ? MAGIC_NUMBER : +num + 1)],
        );
        await this.dropCellsDown();
        // 如果连击，则增加剩余步骤数
        if (!triggerPoint2) {
          this.increaseLives(1);
        }
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
              this.setCellNumber(point, model.getRandomNumber());
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
                this.setCellNumber(pointAbove, model.getRandomNumber());
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
      if (num === undefined) {
        num = cell.getNumber() + 1;
      }
      await cell.fadeOut();
      if (num > BIGGEST_NUMBER) {
        num = MAGIC_NUMBER;
      }
      this.setCellNumber(point, num);
      // 发红包
      if (num === MAGIC_NUMBER) {
        this.dispatchEventWith("MAGIC_GOT");
      }
      await cell.fadeIn();
    }

    private async collapseCellBySteps(
      from: Point,
      lives: Point[],
    ) {
      let current = from;
      const increases = [];
      const length = lives.length;
      for (let i = 0; i < length; i++) {
        const step = lives[i];
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

    private setCellNumber(point: Point, num: number) {
      // 先更新模型
      this.model.setNumberAt(point, num);
      // 再设置 UI
      this.getCellAt(point).setNumber(num);
    }

    private updateView(): void {
      const { cols, rows, model } = this;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const point: Point = [col, row];
          this.setCellNumber(point, model.getNumberAt(point));
        }
      }
    }
  }
}
