namespace yyw {
  const MIN_AMOUNT = 0;
  const MAX_AMOUNT = 5;

  export class EnergySys {
    public static async initialize() {
      this.delay = yyw.CONFIG.renewInterval * 60 * 1000;

      // 创建一个计时器对象
      this.timer = new egret.Timer(this.delay, 0);
      // 注册事件侦听器
      this.timer.addEventListener(egret.TimerEvent.TIMER, () => {
        this.syncEnergies();
      }, this);
      // 开始计时
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

    public static up() {
      if (this.amount < MAX_AMOUNT) {
        this.setAmount(this.amount + 1);
      }
    }

    public static getAmount(): number {
      return this.amount;
    }

    private static delay: number;
    private static timer: egret.Timer;
    private static amount: number;

    private static async setAmount(amount: number, renewedAt?: number) {
      this.amount = amount;
      yyw.emit("ENERGY_CHANGE", { amount });

      const payload = {
        energies: this.amount,
      };

      if (renewedAt) {
        Object.assign(payload, {
          renewedAt,
        });
      }

      await yyw.update(payload);
    }

    private static async syncEnergies() {
      const now = Date.now();
      const distance = Math.max(0, now - yyw.USER.renewedAt);
      const remaining = distance % this.delay;
      const renewedAt = now - remaining;
      const amount = (distance / this.delay) | 0; // 取整
      const energies = Math.min(5, (yyw.USER.energies || 0) + amount);

      await this.setAmount(energies, renewedAt);
    }
  }
}
