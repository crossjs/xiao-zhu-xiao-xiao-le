namespace yyw {
  export function random(min: number, max?: number): number {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // export function isConsecutive(numbers: number[]) {
  //   const sorted = numbers.sort((a, b) => a > b ? 1 : -1);
  //   return "01234567".indexOf(sorted.join("")) !== -1;
  // }
}
