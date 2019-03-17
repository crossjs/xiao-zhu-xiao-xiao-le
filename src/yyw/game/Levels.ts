namespace yyw {
  export class Levels {
    public static current(mode: string = CONFIG.mode): Level {
      if (mode === "level") {
        const { level } = CONFIG;
        const data = CONFIG.levels[level - 1];
        if (data) {
          const { limit: { cols = MAX_COLS, rows = MAX_ROWS, ...restLimit }, ...restData } = data;
          return {
            level,
            limit: {
              cols,
              rows,
              ...restLimit,
            },
            ...restData,
          };
        }
        return {
          level: -1,
        };
      }
      return {
        level: 0,
        limit: {
          cols: 6,
          rows: 6,
          // nil: [
          //   0, 1, 2, 3, 4, 5, 6, 7,
          //   8, 15,
          //   16, 23,
          //   24, 31,
          //   32, 39,
          //   40, 47,
          //   48, 55,
          //   56, 57, 58, 59, 60, 61, 62, 63,
          // ],
        },
      };
    }
  }
}
