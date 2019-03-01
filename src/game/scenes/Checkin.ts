namespace game {
  const STORAGE_KEY = "CHECKIN";
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
        const days = await yyw.checkin.get();

        yyw.eachChild(this.groupDays, (child: eui.Group, index: number) => {
          const day = days[index];
          if (day.offset > 0) {
            // 未来
            child.alpha = 0.5;
          } else if (day.checked) {
            // 已签到，显示勾
            child.getChildAt(child.numChildren - 1).visible = true;
          } else {
            const isPast = day.offset < 0;
            // 过去
            if (isPast) {
              child.alpha = 0.75;
            }

            // 当日可签到，以前需要判断补签
            if (!isPast || yyw.reward.can()) {
              const offTap = yyw.onTap(child, async () => {
                if (isPast) {
                  if (!await yyw.reward.apply("checkin")) {
                    return;
                  }
                }
                offTap();
                const [ coins, type ] = bonus[index];
                await yyw.award.save({ coins });
                yyw.emit("COINS_GOT", {
                  type: "checkin",
                  amount: coins,
                });
                if (type) {
                  yyw.emit("TOOL_GOT", {
                    type,
                    amount: 1,
                  });
                }
                yyw.checkin.save(index);
                child.alpha = 1;
                child.getChildAt(child.numChildren - 1).visible = true;
                yyw.showToast(`${isPast ? "补签" : "签到"}成功，奖励已发放`);
              }, true);
            }
          }
        });
      }

      yyw.analysis.addEvent("7进入场景", { s: "每日签到" });
    }
  }
}
