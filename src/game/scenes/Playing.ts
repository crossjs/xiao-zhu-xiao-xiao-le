namespace game {
  export class Playing extends Base {
    private mainGroup: eui.Group;
    private btnAdd: eui.Image;
    private btnShuffle: eui.Image;
    private btnBack: eui.Image;
    private redpack: Redpack;
    private words: Words;
    private tfdScore: eui.BitmapLabel;
    private tfdLevel: eui.BitmapLabel;
    private tfdCombo: eui.BitmapLabel;
    private sndSwitch: SwitchSound;
    private sndMagic: MagicSound;
    private bmpClosest: egret.Bitmap;
    // private b1: eui.Image;
    // private b2: eui.Image;
    // private b3: eui.Image;
    // private b4: eui.Image;
    // private b5: eui.Image;
    private cellWidth: number = 144;
    private cols: number = 5;
    private rows: number = 5;
    private maxNum: number = 5;
    private model: Model;
    private cells: Cell[][];
    /** 可用的剩余步数 */
    private steps: number = 5;
    private score: number = 0;
    private tweenCells: yyw.Set;
    private initialized: boolean = false;
    /** 连击数 */
    private maxComboTimes: number = 0;
    private comboTimes: number = 0;
    private wordsThreshold: number = 2;

    public constructor() {
      super();
      this.model = new Model(this.cols, this.rows, this.maxNum);
      this.tweenCells = new yyw.Set();
      this.addEventListener(
        egret.Event.ADDED_TO_STAGE,
        () => {
          if (this.initialized) {
            this.restart();
          }
        },
        this,
      );
      this.addEventListener(
        egret.Event.REMOVED_FROM_STAGE,
        () => {
          yyw.OpenDataContext.postMessage({
            command: "closeClosest",
          });
        },
        this,
      );
    }

    public restart() {
      this.reset();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.createNumbersView();
      this.createRedpackView();
      this.createWordsView();
      this.handleTouch();

      this.sndSwitch = new SwitchSound();
      this.sndMagic = new MagicSound();

      this.mainGroup.anchorOffsetX
        = this.mainGroup.anchorOffsetY = 360;
      this.mainGroup.x += 360;
      this.mainGroup.y += 360;

      this.initialized = true;
    }

    private reset() {
      this.tweenCells.each((cell: Cell) => {
        cell.reset();
        this.tweenCells.del(cell);
      });
      this.steps = 5;
      this.increaseSteps(0);
      this.score = 0;
      this.increaseScore(0);
      this.model = new Model(this.cols, this.rows, this.maxNum);
      this.updateView();
    }

    private createNumbersView(): void {
      const { model, cellWidth, cols, rows } = this;
      const numbers = model.geNumbers();
      this.cells = [];
      for (let row = 0; row < rows; row++) {
        const r = this.cells[row] = [];
        for (let col = 0; col < cols; col++) {
          const cell = r[col] = new Cell(col, row, cellWidth);
          this.mainGroup.addChild(cell);
          // 要先 addChild，里面才会有东西
          cell.setNumber(numbers[row][col]);
        }
      }
    }

    private createRedpackView() {
      this.redpack = new Redpack();
      this.body.addChild(this.redpack);
    }

    private createWordsView() {
      this.words = new Words();
      this.body.addChild(this.words);
    }

    private handleTouch() {
      const { mainGroup, cellWidth, cols } = this;
      mainGroup.touchEnabled = true;

      // 是否正在拖动
      let running: boolean = false;
      // 是否正在拖动
      let dragging: boolean = false;
      // 起始点
      let fromXY: [number, number];
      // 起始单元格
      let fromPoint: Point;

      function xy2p(xy: number): number {
        return Math.max(0, Math.min(cols, Math.floor(xy / cellWidth)));
      }

      const handleBegin = (e: egret.TouchEvent) => {
        if (running) {
          return;
        }
        dragging = true;
        const { localX, localY } = e;
        fromXY = [localX, localY];
        fromPoint = [
          xy2p(localX),
          xy2p(localY),
        ];
        this.getCellAt(fromPoint).zoomIn();
      };

      const handleDrag = async (e: egret.TouchEvent) => {
        if (!dragging) {
          return;
        }

        // e.preventDefault();
        // e.stopPropagation();

        const { localX, localY } = e;
        const toPoint: Point = [
          xy2p(localX),
          xy2p(localY),
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
        dragging = false;
        this.getCellAt(fromPoint).zoomOut();
        running = true;
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
            this.increaseSteps(-1);
            if (this.steps === 0) {
              const scene: Failing = SceneManager.toScene("failing");
              scene.saveData({
                score: this.score,
                level: this.model.getLevel(),
                combo: this.maxComboTimes,
              });
            }
          }
        }
        running = false;
      };

      const handleEnd = () => {
        if (running) {
          return;
        }
        dragging = false;
        this.getCellAt(fromPoint).zoomOut();
      };

      mainGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, handleBegin, this);
      mainGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, handleDrag, this);
      mainGroup.addEventListener(egret.TouchEvent.TOUCH_END, handleEnd, this);
      mainGroup.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, handleEnd, this);

      this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        this.increaseSteps(1);
      }, this);

      this.btnShuffle.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
        if (running) {
          return;
        }
        running = true;
        await this.shuffle();
        running = false;
      }, this);

      this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        SceneManager.toScene("landing");
      }, this);
    }

    private async growUpCellsOf(num: number) {
      const points: Point[] = this.getPointsOf(num);
      num++;
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
        this.redpack.show();
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
      this.tfdScore.text = String(this.score);
      const level = Math.ceil(this.score / 3000);
      this.model.setLevel(level);
      this.tfdLevel.text = String(level);
      this.showClosest();
    }

    /**
     * 更新剩余步骤及其显示
     */
    private increaseSteps(n: number) {
      this.steps = Math.max(0, Math.min(5, this.steps + n));
      for (let step = 1; step <= 5; step++) {
        this[`b${step}`].visible = step <= this.steps;
      }
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
        y: (to[1] - from[1]) * this.cellWidth,
      }], duration, onResolve);
    }

    private resetCombo() {
      this.tfdCombo.text = `${this.comboTimes = 0}`;
    }

    private increaseCombo() {
      this.tfdCombo.text = `${++this.comboTimes}`;
      // 2
      if (this.comboTimes >= this.wordsThreshold) {
        // 2,3 -> 0
        // 4,5 -> 1
        // 6,7 -> 2
        // 8,9,10,... -> 3
        this.words.showWord(
          Math.floor((this.comboTimes - this.wordsThreshold) / this.wordsThreshold),
        );
      }
      this.maxComboTimes = Math.max(this.maxComboTimes, this.comboTimes);
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

        await Promise.all(
          [...points.map((point) => {
            const steps = getSteps(
              point,
              triggerPoint,
              points.filter((p) => !isEqual(p, point)),
            );
            return this.collapseCellBySteps(point, steps);
          }), this.growUpCellAt(triggerPoint, isSF ? MAGIC_NUMBER : +num + 1)],
        );
        await this.dropCellsDown();
        // 如果连击，则增加剩余步骤数
        if (!triggerPoint2) {
          this.increaseSteps(1);
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
              await this.tweenFromTo(pointAbove, point, 10);
              this.switchNumbers(pointAbove, point);
            }
          }
        }
      }
    }

    private async growUpCellAt(point: Point, num: number) {
      const cell = this.getCellAt(point);
      this.tweenCells.add(cell);
      await cell.fadeOut();
      if (num > BIGGEST_NUMBER) {
        num = MAGIC_NUMBER;
      }
      this.setCellNumber(point, num);
      // 发红包
      if (num === MAGIC_NUMBER) {
        this.redpack.show();
      }
      await cell.fadeIn();
      this.tweenCells.del(cell);
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
          y: (step[1] - current[1]) * this.cellWidth,
        });
        current = step;
      }
      // 旋转
      increases.push({
        rotation: 1080,
        alpha: -1,
      });
      const cell = this.getCellAt(from);
      this.tweenCells.add(cell);
      cell.flashScore();
      this.increaseScore(cell.getNumber() * 10);
      await cell.tweenTo(increases, 500, () => {
        this.setCellNumber(from, 0);
      });
      this.tweenCells.del(cell);
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
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const point: Point = [col, row];
          this.setCellNumber(point, this.model.getNumberAt(point));
        }
      }
    }

    private async shuffle(): Promise<void> {
      const tween = PromisedTween.get(this.mainGroup);
      await tween.to({
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        rotation: 360,
      }, 300);

      this.model.shuffle();
      this.updateView();

      await tween.to({
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        rotation: 0,
      }, 200);

      await this.mergeChains();
    }

    /**
     * 显示分数接近的好友，通过开放数据域
     */
    @yyw.debounce(100)
    private showClosest() {
      const width = 222;
      const height = 72;
      if (!this.bmpClosest) {
        this.bmpClosest = yyw.OpenDataContext.createDisplayObject(null, width, height);
        this.body.addChild(this.bmpClosest);
        this.bmpClosest.x = 21;
        this.bmpClosest.y = -12;
      }
      // 主域向子域发送自定义消息
      yyw.OpenDataContext.postMessage({
        command: "openClosest",
        score: this.score,
        width,
        height,
        openid: yyw.CURRENT_USER.providerId || 0,
      });
    }
  }
}
