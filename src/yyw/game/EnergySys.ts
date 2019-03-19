namespace yyw {
  export class EnergySys {
    public static async initialize() {
      yyw.on("ENERGY_IO", ({ data: { amount }}) => {
        this.amount = Math.max(0, Math.min(5, this.amount + amount));
      });

      this.delay = yyw.CONFIG.renewInterval * 60 * 1000;

      // 创建一个计时器对象
      this.timer = new egret.Timer(this.delay, 0);
      // 注册事件侦听器
      this.timer.addEventListener(egret.TimerEvent.TIMER, () => {
        this.syncEnergies();
      }, this);

      this.timer.start();

      await this.syncEnergies();
    }

    public static use(): boolean {
      if (this.amount > 0) {
        this.setAmount(this.amount - 1);
        return true;
      }
      return false;
    }

    public static getAmount(): number {
      return this.amount;
    }

    private static delay: number;
    private static timer: egret.Timer;
    private static amount: number;

    private static async setAmount(amount: number, renewedAt: number = Date.now()) {
      this.amount = amount;
      yyw.emit("ENERGY_CHANGE", { amount });

      await yyw.update({
        renewedAt,
        energies: this.amount,
      });
    }

    private static async syncEnergies() {
      const renewedAt = Date.now();
      const distance = Math.max(0, renewedAt - yyw.USER.renewedAt);
      const amount = (distance / this.delay) | 0; // 取整
      const energies = Math.min(5, (yyw.USER.energies || 0) + amount);

      await this.setAmount(energies, renewedAt);
    }
  }
}
