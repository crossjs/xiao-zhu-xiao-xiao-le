namespace yyw {

  const oneDay = 24 * 60 * 60 * 1000;

  export function getNowEnd(mode: string = "day") {
    const date = new Date();
    const days = mode === "week" ? (8 - (date.getDay() || 7)) : 1;
    const now = date.getTime();
    const begin = now - now % oneDay;
    const end = begin + oneDay * days;
    return { now, end };
  }
}
