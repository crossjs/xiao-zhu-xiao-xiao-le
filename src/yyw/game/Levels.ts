namespace yyw {
  export class Levels {
    public static current(mode: string = CONFIG.mode): Level {
      if (mode === "level") {
        const { level } = CONFIG;
        const data = CONFIG.levels[level - 1];
        if (data) {
          const { limit: { cols = MAX_COLS, rows = MAX_ROWS, maxNum, ...restLimit }, ...restData } = data;
          return {
            level,
            limit: {
              cols,
              rows,
              maxNum: maxNum || Math.min(cols, rows),
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
          maxNum: 6,
          ice: [ 14, 15, 20, 21 ],
        },
      };
    }
  }
}
