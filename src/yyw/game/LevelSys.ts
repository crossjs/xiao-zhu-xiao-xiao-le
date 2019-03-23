namespace yyw {
  export interface Level {
    level?: number;
    limit?: {
      cols?: number;
      rows?: number;
      cells?: number[][];
      maxNum?: number;
    };
    goals?: {
      [num: string]: number;
    };
  }

  const SCORE_LEVEL = {
    level: 0,
    limit: {
      cells: [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 2, 2, 1, 1],
        [1, 1, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
      ],
    },
  };

  const EMPTY_LEVEL = {
    level: -1,
  };

  export class LevelSys {
    public static async initialize() {
      this.levels = await cloud.read("levels.json") || [];
      this.cursor = USER.level || 0;
    }

    public static current(mode: string = this.mode): void {
      if (mode === "level") {
        const data = this.levels[this.cursor];
        if (data) {
          this.currentLevel = {
            level: this.cursor + 1,
            ...data,
          };
        } else {
          this.currentLevel = EMPTY_LEVEL;
        }
      } else {
        this.currentLevel = SCORE_LEVEL;
      }
    }

    public static forward(mode?: string): void {
      this.cursor++;
      this.current(mode);
      if (this.level === -1) {
        // 重置指向的关卡位置
        this.cursor--;
      }
    }

    // TODO 快照与关卡对应
    public static get snapshot(): any {
      return USER.arena && USER.arena[this.mode];
    }

    public static get level(): Level["level"] {
      return this.currentLevel.level;
    }

    public static get mode(): "score" | "level" {
      return this.level === 0 ? "score" : "level";
    }

    public static get rows(): Level["limit"]["rows"] {
      const { rows, cells } = this.currentLevel.limit;
      return rows || cells.length;
    }

    public static get cols(): Level["limit"]["cols"] {
      const { cols, cells } = this.currentLevel.limit;
      return cols || cells[0].length;
    }

    public static get cells(): Level["limit"]["cells"] {
      return this.currentLevel.limit.cells || [];
    }

    public static get maxNum(): Level["limit"]["maxNum"] {
      return this.currentLevel.limit.maxNum || Math.min(this.cols, this.rows);
    }

    public static get goals(): Level["goals"] {
      return this.currentLevel.goals;
    }

    private static levels: Level[];
    private static cursor: number = 0;
    private static currentLevel: Level = SCORE_LEVEL;
  }
}
