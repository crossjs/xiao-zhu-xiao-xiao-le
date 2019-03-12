namespace yyw {
  export function random(min: number, max?: number): number {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
