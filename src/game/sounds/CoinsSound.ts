namespace game {
  /**
   * 获得金币声效
   */
  export class CoinsSound extends yyw.Sound {
    protected url: string = `${yyw.CONFIG.serverOrigin}/file/coins.m4a`;
  }
}
