namespace game {
  export class Play extends eui.Component implements eui.UIComponent {
    private mainGroup: eui.Group;
    private btnReload: eui.Image;
    private cellWidth: number;
    private cols: number;
    private rows: number;
    private maxNum: number;
    private model: game.Model;
    private cells: game.Cell[][];
    private tweenCells: yyw.Set;

    public constructor() {
      super();
      this.cellWidth = 144;
      this.maxNum = 5;
      this.cols = 5;
      this.rows = 5;
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

      this.btnReload.touchEnabled = true;
      this.btnReload.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        this.tweenCells.each((cell: game.Cell) => {
          egret.Tween.removeTweens(cell);
          cell.scaleX = cell.scaleY = cell.alpha = 1;
        });
        this.model = new game.Model(this.cols, this.rows, this.maxNum);
        this.updateView();
      }, this);
    }

    private createView(): void {
      const { model, cellWidth } = this;
      const numbers = model.geNumbers();
      const anchorOffset = cellWidth / 2;
      this.cells = [];
      for (let row = 0; row < this.rows; row++) {
        const r = this.cells[row] = [];
        for (let col = 0; col < this.cols; col++) {
          const cell = new game.Cell([col, row], this.cellWidth);
          cell.anchorOffsetX = cell.anchorOffsetY = anchorOffset;
          cell.x = col * this.cellWidth + anchorOffset;
          cell.y = row * this.cellWidth + anchorOffset;
          this.mainGroup.addChild(cell);
          // 要先 addChild，里面才会有东西
          cell.setNumber(numbers[row][col]);
          r[col] = cell;
        }
      }
    }

    private handleTouch() {
      const { mainGroup, cellWidth } = this;
      mainGroup.touchEnabled = true;

      // 是否正在拖动
      let dragging: boolean = false;
      // 起始点
      let fromXY: [number, number];
      // 起始单元格
      let fromPoint: game.Point;

      const handleDrag = (e: egret.TouchEvent) => {
        if (dragging) {
          const { localX, localY } = e;
          const toXY: [number, number] = [localX, localY];
          const toPoint: game.Point = [
            Math.floor(localX / cellWidth),
            Math.floor(localY / cellWidth),
          ];
          egret.log("toPoint", toPoint);
          const slope = yyw.getSlope(toXY, fromXY);
          // 角度太模棱两可的，不处理
          if ((slope > 2 || slope < 0.5) && yyw.isNeighbor(fromPoint, toPoint)) {
            dragging = false;
            this.switchNumbers(fromPoint, toPoint);
            this.mergeChains(this.model.getNumberAt(toPoint), toPoint, fromPoint);
          }
        }
      };

      mainGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
        dragging = true;
        const { localX, localY } = e;
        fromXY = [localX, localY];
        fromPoint = [
          Math.floor(localX / cellWidth),
          Math.floor(localY / cellWidth),
        ];
        egret.log("fromPoint", fromPoint);
      }, this);
      mainGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, handleDrag, this);
      mainGroup.addEventListener(egret.TouchEvent.TOUCH_END, () => {
        dragging = false;
      }, this);
    }

    private switchNumbers(from: game.Point, to: game.Point): void {
      egret.log("switching", from, to);
      const { model } = this;
      const numFrom = model.getNumberAt(from);
      const numTo = model.getNumberAt(to);
      this.setCellNumber(from, numTo);
      this.setCellNumber(to, numFrom);
    }

    /** 寻找可合并的数字链 */
    private async mergeChains(firstNumber?: number, triggerPoint?: game.Point, triggerPoint2?: game.Point) {
      const { model } = this;
      const [ num, points ] = model.getChain(firstNumber);
      // 找到
      if (num) {
        // egret.log(num, points);
        if (!triggerPoint) {
          triggerPoint = points.shift();
        } else {
          let index = yyw.getIndexOf(points, triggerPoint);
          if (index !== -1) {
            points.splice(index, 1);
          } else {
            index = yyw.getIndexOf(points, triggerPoint2);
            if (index !== -1) {
              triggerPoint = triggerPoint2;
              points.splice(index, 1);
            } else {
              triggerPoint = points.shift();
            }
          }
        }

        await Promise.all(
          points.map((point) => {
            const steps = yyw.getSteps(point, triggerPoint, points.filter((p) => !yyw.isEqual(p, point)));
            return this.collapseCellBySteps(
              // 当前点
              point,
              // 目标点
              steps,
              // model.getRandomNumber([model.getNumberAt(point)])
              );
          }),
        );
        await this.growUpCellAt(triggerPoint, +num + 1);
        await this.dropCellsDown();
        // 继续找
        this.mergeChains();
      }
    }

    private async dropCellsDown() {
      const { model, cols, rows } = this;
      for (let col = 0; col < cols; col++) {
        let row = rows;
        while (row--) {
          const point: game.Point = [col, row];
          const num = model.getNumberAt(point);
          if (!num) {
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
              await this.dropCellDownTo(pointAbove, point);
            }
          }
        }
      }
    }

    private async dropCellDownTo(from: game.Point, to: game.Point) {
      egret.log("dropCellDownTo", from, to);
      return new Promise((resolve, reject) => {
        const cell = this.getCellAt(from);
        const { y } = cell;
        this.tweenCells.add(cell);
        egret.Tween
        .get(cell)
        .to({
          y: y + (to[1] - from[1]) * this.cellWidth,
        }, 100, egret.Ease.quadOut)
        .call(() => {
          this.switchNumbers(from, to);
          cell.y = y;
          resolve();
          this.tweenCells.del(cell);
        });
      });
    }

    private async growUpCellAt(point: game.Point, num: number) {
      return new Promise((resolve, reject) => {
        const cell = this.getCellAt(point);
        this.tweenCells.add(cell);
        egret.Tween
        .get(cell)
        .to({
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          rotation: 1080,
        }, 500, egret.Ease.quadOut)
        .call(() => {
          this.setCellNumber(point, num);
          egret.Tween
          .get(cell)
          .to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            rotation: 0,
          }, 500, egret.Ease.quadOut)
          .call(() => {
            resolve();
            this.tweenCells.del(cell);
          });
        });
      });
    }

    private async collapseCellBySteps(
      from: game.Point,
      steps: game.Point[],
      // num: number,
    ) {
      return new Promise((resolve, reject) => {
        const cell = this.getCellAt(from);
        let { x, y } = cell;
        const ox = x;
        const oy = y;
        this.tweenCells.add(cell);
        let tween = egret.Tween.get(cell);
        let current = from;
        for (const step of steps) {
          x += (step[0] - current[0]) * this.cellWidth;
          y += (step[1] - current[1]) * this.cellWidth;
          tween = tween.to({
            x,
            y,
            rotation: 1080,
          }, 500 / steps.length, egret.Ease.quadOut);
          current = step;
        }

        tween.call(() => {
          resolve();
          this.setCellNumber(from, 0);
          cell.alpha = 1;
          cell.x = ox;
          cell.y = oy;
          cell.rotation = 0;
          // this.setCellNumber(from, num);
          this.tweenCells.del(cell);
        });
      });
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
