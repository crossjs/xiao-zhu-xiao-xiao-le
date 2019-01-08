namespace game {
  export class Play extends eui.Component implements eui.UIComponent {
    private mainGroup: eui.Group;
    private btnBack: eui.Image;
    private btnReload: eui.Image;
    private tfdScore: eui.BitmapLabel;
    private tfdDifficulty: eui.BitmapLabel;
    // private b1: eui.Image;
    // private b2: eui.Image;
    // private b3: eui.Image;
    // private b4: eui.Image;
    // private b5: eui.Image;
    private cellWidth: number = 144;
    private cols: number = 5;
    private rows: number = 5;
    private maxNum: number = 5;
    private model: game.Model;
    private cells: game.Cell[][];
    /** 可用的剩余步数 */
    private steps: number = 5;
    private scores: number = 0;
    private tweenCells: yyw.Set;

    public constructor() {
      super();
      this.model = new game.Model(this.cols, this.rows, this.maxNum);
      this.tweenCells = new yyw.Set();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.createView();
      this.handleTouch();

      this.btnBack.touchEnabled = true;
      this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        SceneManager.toScene("landing");
      }, this);

      this.btnReload.touchEnabled = true;
      this.btnReload.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reset, this);
    }

    private reset() {
      this.tweenCells.each((cell: game.Cell) => {
        cell.reset();
        this.tweenCells.del(cell);
      });
      this.steps = 5;
      this.increaseSteps(0);
      this.scores = 0;
      this.increaseScores(0);
      this.model = new game.Model(this.cols, this.rows, this.maxNum);
      this.updateView();
    }

    private createView(): void {
      const { model, cellWidth, cols, rows } = this;
      const numbers = model.geNumbers();
      this.cells = [];
      for (let row = 0; row < rows; row++) {
        const r = this.cells[row] = [];
        for (let col = 0; col < cols; col++) {
          const cell = r[col] = new game.Cell(col, row, cellWidth);
          this.mainGroup.addChild(cell);
          // 要先 addChild，里面才会有东西
          cell.setNumber(numbers[row][col]);
        }
      }
    }

    private handleTouch() {
      const { mainGroup, cellWidth } = this;
      mainGroup.touchEnabled = true;

      // 是否正在拖动
      let running: boolean = false;
      // 是否正在拖动
      let dragging: boolean = false;
      // 起始点
      let fromXY: [number, number];
      // 起始单元格
      let fromPoint: game.Point;

      const handleBegin = (e: egret.TouchEvent) => {
        if (running) {
          return;
        }
        dragging = true;
        const { localX, localY } = e;
        fromXY = [localX, localY];
        fromPoint = [
          Math.floor(localX / cellWidth),
          Math.floor(localY / cellWidth),
        ];
        this.getCellAt(fromPoint).zoomIn();
      };

      const handleDrag = async (e: egret.TouchEvent) => {
        if (!dragging) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const { localX, localY } = e;
        const toPoint: game.Point = [
          Math.floor(localX / cellWidth),
          Math.floor(localY / cellWidth),
        ];
        // 角度太模棱两可的，不处理
        if (!yyw.isNeighbor(fromPoint, toPoint)) {
          return;
        }
        const toXY: [number, number] = [localX, localY];
        const slope = yyw.getSlope(toXY, fromXY);
        if (slope < 2 && slope > 0.5) {
          return;
        }
        dragging = false;
        this.getCellAt(fromPoint).zoomOut();
        running = true;
        // 普通交换
        this.tweenFromTo(fromPoint, toPoint, 300);
        await this.tweenFromTo(toPoint, fromPoint, 300);
        this.switchNumbers(fromPoint, toPoint);
        const numFrom = this.model.getNumberAt(fromPoint);
        const numTo = this.model.getNumberAt(toPoint);
        if (numFrom !== numTo) {
          let magicPoint: game.Point;
          let numToGrowUp: number;
          if (numFrom === game.MAGIC_NUMBER) {
            magicPoint = fromPoint;
            numToGrowUp = numTo;
          } else if (numTo === game.MAGIC_NUMBER) {
            magicPoint = toPoint;
            numToGrowUp = numFrom;
          }
          if (magicPoint) {
            await this.growUpCellsOf(numToGrowUp);
            this.setCellNumber(magicPoint, 0);
            await this.dropCellsDown();
          }
          const hasChain = await this.mergeChains(toPoint, fromPoint);
          if (!hasChain) {
            this.increaseSteps(-1);
            if (this.steps === 0) {
              egret.log("Game Over");
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
    }

    private growUpCellsOf(num: number) {
      const points: game.Point[] = this.getPointsOf(num);
      return Promise.all(
        points.map(async (point) => {
          await this.getCellAt(point).tweenUp();
          return this.setCellNumber(point, num + 1);
        }),
      );
    }

    private getPointsOf(num: number): game.Point[] {
      const matchedPoints: game.Point[] = [];
      const { model, cols, rows } = this;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const point: game.Point = [col, row];
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
    private increaseScores(n: number) {
      this.scores += n;
      this.tfdScore.text = String(this.scores);
      const difficulty = Math.ceil(this.scores / 3000);
      this.model.setDifficulty(difficulty);
      this.tfdDifficulty.text = String(difficulty);
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

    private switchNumbers(from: game.Point, to: game.Point): void {
      const { model } = this;
      const numFrom = model.getNumberAt(from);
      const numTo = model.getNumberAt(to);
      this.setCellNumber(from, numTo);
      this.setCellNumber(to, numFrom);
    }

    private tweenFromTo(from: game.Point, to: game.Point, duration: number = 100, onResolve?: any): Promise<void> {
      return this.getCellAt(from).tweenTo([{
        x: (to[0] - from[0]) * this.cellWidth,
        y: (to[1] - from[1]) * this.cellWidth,
      }], duration, onResolve);
    }

    /** 寻找可合并的数字链 */
    private async mergeChains(
      triggerPoint?: game.Point,
      triggerPoint2?: game.Point,
    ): Promise<boolean> {
      const { model } = this;
      const firstNumber = triggerPoint ? model.getNumberAt(triggerPoint) : 0;
      const [ num, points ] = model.getChain(firstNumber === game.MAGIC_NUMBER ? 0 : firstNumber);
      // 找到
      if (num) {
        const isMagic = yyw.isStraight(points);
        let triggerPointNext: game.Point;
        if (!triggerPoint) {
          triggerPoint = points.shift();
        } else {
          let index = yyw.getIndexOf(points, triggerPoint);
          if (index !== -1) {
            points.splice(index, 1);
            triggerPointNext = triggerPoint2;
          } else {
            if (triggerPoint2) {
              index = yyw.getIndexOf(points, triggerPoint2);
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
            const steps = yyw.getSteps(
              point,
              triggerPoint,
              points.filter((p) => !yyw.isEqual(p, point)),
            );
            return this.collapseCellBySteps(point, steps);
          }), this.growUpCellAt(triggerPoint, isMagic ? game.MAGIC_NUMBER : +num + 1)],
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
        while (row--) {
          const point: game.Point = [col, row];
          const num = model.getNumberAt(point);
          if (num <= 0) {
            if (row === 0) {
              this.setCellNumber(point, model.getRandomNumber());
            } else {
              let rowAbove = row;
              let numAbove: number;
              let pointAbove: game.Point;
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

    private async growUpCellAt(point: game.Point, num: number) {
      const cell = this.getCellAt(point);
      this.tweenCells.add(cell);
      await cell.fadeOut();
      this.setCellNumber(point, num);
      await cell.fadeIn();
      this.tweenCells.del(cell);
    }

    private async collapseCellBySteps(
      from: game.Point,
      steps: game.Point[],
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
      this.increaseScores(cell.getNumber() * 10);
      await cell.tweenTo(increases, 500, () => {
        this.setCellNumber(from, 0);
      });
      this.tweenCells.del(cell);
    }

    private getCellAt(point: game.Point): game.Cell {
      return this.cells[point[1]][point[0]];
    }

    private setCellNumber(point: game.Point, num: number) {
      // 先更新模型
      this.model.setNumberAt(point, num);
      // 再设置 UI
      this.getCellAt(point).setNumber(num);
    }

    private updateView(): void {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const point: game.Point = [col, row];
          this.setCellNumber(point, this.model.getNumberAt(point));
        }
      }
    }
  }
}
