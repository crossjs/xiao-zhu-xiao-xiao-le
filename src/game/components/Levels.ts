namespace game {
  export class Levels {
    public static current(): yyw.Level {
      if (yyw.CONFIG.mode === "level") {
        return yyw.CONFIG.levels[yyw.CONFIG.level - 1];
      }
      return {
        limit: {
          nil: [
            0, 1, 2, 3, 4, 5, 6, 7,
            8, 15,
            16, 23,
            24, 31,
            32, 39,
            40, 47,
            48, 55,
            56, 57, 58, 59, 60, 61, 62, 63,
          ],
        },
      };
    }
  }
}
