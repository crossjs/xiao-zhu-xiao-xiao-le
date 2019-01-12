namespace game {
  export function isNeighbor(point1: Point, point2: Point): boolean {
    return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]) === 1;
  }

  export function isEqual(point1: Point, point2: Point): boolean {
    return point1[0] === point2[0] && point1[1] === point2[1];
  }

  /** 是否直线（至少 5 个在一条线上） */
  export function isStraight(points: Point[]): boolean {
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

  export function getIndexOf(points: Point[], point: Point): number {
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (isEqual(p, point)) {
        return i;
      }
    }
    return -1;
  }

  export function getNeighborOf(point: Point, points: Point[]): Point {
    for (const p of points) {
      if (isNeighbor(p, point)) {
        return p;
      }
    }
  }

  /**
   * 获取路径
   * @param from 起点
   * @param to 重点
   * @param stops 可能的中途点
   */
  export function getSteps(from: Point, to: Point, stops: Point[]) {
    // 如果是邻居，直接返回
    if (isNeighbor(from, to)) {
      return [to];
    }
    const steps = [];
    const clonedStops = stops.slice(0);
    let current = from;
    let stop: Point;
    while ((stop = getNeighborOf(current, clonedStops))) {
      steps.push(stop);
      // 移除已匹配到的，避免回环
      const index = clonedStops.indexOf(stop);
      clonedStops.splice(index, 1);
      current = stop;
      if (isNeighbor(current, to)) {
        steps.push(to);
        return steps;
      }
    }
    // 没找到，换个方向
    return getSteps(
      from,
      to,
      stops.filter((p) => {
        return steps.length === 0 || !isEqual(p, steps[steps.length - 1]);
      }),
    );
  }

  export function getSlope(point1: Point, point2: Point): number {
    const dx = Math.abs(point1[0] - point2[0]);
    const dy = Math.abs(point1[1] - point2[1]);
    return dx === 0 ? Number.MAX_SAFE_INTEGER : dy / dx;
  }

  export class PromisedTween {
    public static get(target: any, options?: any) {
      return new PromisedTween(target, options);
    }

    public static removeTweens(target: any) {
      egret.Tween.removeTweens(target);
    }

    public static pauseTweens(target: any) {
      egret.Tween.pauseTweens(target);
    }

    public static resumeTweens(target: any) {
      egret.Tween.resumeTweens(target);
    }

    public static removeAllTweens() {
      egret.Tween.removeAllTweens();
    }

    private tween: egret.Tween;

    constructor(target: any, options: any = {}) {
      this.tween = egret.Tween.get(target, options);
    }

    public to(
      props: any,
      duration: number = 100,
      ease: any = egret.Ease.quadOut,
    ): Promise<void> {
      return new Promise((resolve) => {
        this.tween.setPaused(false).to(props, duration, ease).call(resolve);
      });
    }
  }
}
