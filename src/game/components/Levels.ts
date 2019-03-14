namespace game {
  export class Levels {
    public static current() {
      return yyw.CONFIG.levels[yyw.CONFIG.level - 1];
    }
  }
}
