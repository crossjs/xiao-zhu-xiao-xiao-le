namespace game {
  const STORAGE_KEY = "YYW_G4_CHECKIN";
  const bonus: any[] = [[100], [150], [200], [250, "breaker"], [300], [350], [400, "shuffle"]];

  export class Checkin extends yyw.Base {
    private groupDays: eui.Group;

    protected destroy() {
      //
    }

    /**
     * 准备榜单
     */
    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        const checkins = await yyw.storage.get(STORAGE_KEY) || {};

        const now = new Date();
        const day = now.getDay() || 7;
        const end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7 - day,
          23,
          59,
          59,
        );

        yyw.eachChild(this.groupDays, (child: eui.Group, index: number) => {
          if (index >= day) {
            // 未来
            child.alpha = 0.5;
          } else if (checkins[`${index}`]) {
            // 已签到，显示勾
            child.getChildAt(child.numChildren - 1).visible = true;
          } else {
            const isPast = index + 1 < day;
            // 过去
            if (isPast) {
              child.alpha = 0.75;
            }

            const offTap = yyw.onTap(child, async (e: egret.TouchEvent) => {
              let couldCheckin = true;
              if (isPast) {
                // 补签
                couldCheckin = await yyw.reward.apply();
              }
              if (couldCheckin) {
                offTap();
                const [ coins, type ] = bonus[index][0];
                await yyw.award.save({ coins });
                yyw.emit("COINS_CHANGE", coins);
                if (type) {
                  yyw.emit("TOOL_GOT", {
                    type,
                    amount: 1,
                  });
                }
                const expiresIn = end.getTime() - Date.now();
                Object.assign(checkins, { [`${index}`]: true });
                yyw.storage.set(STORAGE_KEY, checkins, expiresIn);
                child.alpha = 1;
                child.getChildAt(child.numChildren - 1).visible = true;
                yyw.showToast(`${isPast ? "补签" : "签到"}成功，奖励已发放`);
              }
            }, true);
          }
        });
      }

      // this.showFriend();
    }
  }
}
