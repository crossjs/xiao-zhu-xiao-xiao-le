namespace yyw {
  export function isNeighbor(point1: game.Point, point2: game.Point): boolean {
    return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]) === 1;
  }

  export function isEqual(point1: game.Point, point2: game.Point): boolean {
    return point1[0] === point2[0] && point1[1] === point2[1];
  }

  /** 是否直线（至少 5 个在一条线上） */
  export function isStraight(points: game.Point[]): boolean {
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

  export function getIndexOf(points: game.Point[], point: game.Point): number {
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (yyw.isEqual(p, point)) {
        return i;
      }
    }
    return -1;
  }

  export function getNeighborOf(point: game.Point, points: game.Point[]): game.Point {
    for (const p of points) {
      if (yyw.isNeighbor(p, point)) {
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
  export function getSteps(from: game.Point, to: game.Point, stops: game.Point[]) {
    // 如果是邻居，直接返回
    if (yyw.isNeighbor(from, to)) {
      return [to];
    }
    const steps = [];
    let current = from;
    let stop: game.Point;
    while ((stop = yyw.getNeighborOf(current, stops))) {
      steps.push(stop);
      current = stop;
      if (yyw.isNeighbor(current, to)) {
        steps.push(to);
        return steps;
      }
    }
    // 没找到，换个方向
    return yyw.getSteps(
      from,
      to,
      stops.filter((p) => {
        return steps.length === 0 || !yyw.isEqual(p, steps[steps.length - 1]);
      }),
    );
  }

  export function getSlope(point1: game.Point, point2: game.Point): number {
    const dx = Math.abs(point1[0] - point2[0]);
    const dy = Math.abs(point1[1] - point2[1]);
    return dx === 0 ? Number.MAX_SAFE_INTEGER : dy / dx;
  }
}
