namespace yyw {
  const map = new Map();
  export const define = {
    set: (key: string, value: any) => map.set(key, value),
    get: (key: string) => map.get(key),
  };
}
