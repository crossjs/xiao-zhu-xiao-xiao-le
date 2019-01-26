namespace yyw {
  export function debounce(timeout: number = 100) {
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
        }, this, timeout * CONFIG.speedRatio);
      };

      return descriptor;
    };
  }
}
