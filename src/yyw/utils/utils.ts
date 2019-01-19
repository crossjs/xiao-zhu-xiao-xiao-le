namespace yyw {
  export function noop() {
    // empty
  }

  export function sliceString(value: string, size: number, asciiAsHalf?: boolean) {
    if (asciiAsHalf) {
      const chars = [];
      const maxIndex = value.length;
      let n = size * 2;
      let i = 0;
      while (n && i <= maxIndex) {
        const char = value.charAt(i++);
        n--;
        if (char.charCodeAt(0) > 255) {
          n--;
        }
        chars.push(char);
      }
      return chars.join("");
    }
    return value.substring(0, size);
  }

  export function toFixed(value: number, fractionDigits: number = 2) {
    return +value.toFixed(fractionDigits);
  }

  export function debounce(timeout: number) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
      }

      const originalMethod = descriptor.value;
      let handle: number;

      descriptor.value = function(...args: any[]) {
        if (handle) {
          egret.clearTimeout(handle);
        }
        handle = egret.setTimeout(() => {
          originalMethod.apply(this, args);
        }, this, timeout);
      };

      return descriptor;
    };
  }

  export async function eachMatrix(matrix: any[][], handler: any): Promise<void> {
    const rows = matrix.length;
    for (let row = 0; row < rows; row++) {
      const r = matrix[row];
      const cols = r.length;
      for (let col = 0; col < cols; col++) {
        await handler(r[col], col, row);
      }
    }
  }
}
