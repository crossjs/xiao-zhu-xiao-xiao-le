namespace yyw {
  export function slice(value: string, size: number, asciiAsHalf?: boolean) {
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
}
