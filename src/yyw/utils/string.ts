namespace yyw {
  export function sliceString(value: string, size: number = 6, asciiAsHalf: boolean = true) {
    if (asciiAsHalf) {
      const chars = [];
      const maxIndex = value.length;
      let n = size * 2;
      let i = 0;
      while (n > 0 && i <= maxIndex) {
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

  export function ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  export function zeroPadding(str: string, size: number): string {
    const padding = "0000000000";
    return `${padding.slice(0, size - str.length)}${str}`;
  }
}
