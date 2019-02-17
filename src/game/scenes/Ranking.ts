namespace game {
  export class Ranking extends yyw.Base {
    private btnFriend: eui.Button;
    private btnWorld: eui.Button;
    private groupFriend: eui.Group;
    private groupWorld: eui.Group;
    // 0, 64, 122, 278
    private pageSize: number = 8;
    private pageIndex: number = 0;
    private pageTotal: number;
    private rankingData: any[];
    private myRankingData: any;
    private removeScroll: () => void;

    protected destroy() {
      this.removeFriend();
      this.removeWorld();
    }

    /**
     * 准备榜单
     */
    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.bg, () => {
          yyw.director.escape();
        }, true);

        // 不知道为什么，EXML 里怎么设置都无法取消冒泡
        // 所以，只能在这里手动阻止了
        yyw.onTap(this.main, (e: egret.TouchEvent) => {
          e.stopPropagation();
        }, true);

        yyw.onTap(this.btnFriend, (e: egret.TouchEvent) => {
          this.removeWorld();
          this.showFriend();
        });

        yyw.onTap(this.btnWorld, (e: egret.TouchEvent) => {
          this.removeFriend();
          this.showWorld();
        });
      }

      this.showFriend();
    }

    private showFriend() {
      const { width, height } = this.groupFriend;
      const bmpFriend = yyw.sub.createDisplayObject(null, width, height);
      this.groupFriend.addChild(bmpFriend);

      // 主域向子域发送自定义消息
      yyw.sub.postMessage({
        command: "openRanking",
        width,
        height,
        openid: yyw.USER.openId || 0,
      });
    }

    private async showWorld() {
      try {
        this.rankingData = await yyw.pbl.all();
        this.rankingData.forEach((item, index) => {
          item.key = index + 1;
        });
        this.myRankingData = this.rankingData.find(({ openId }) => yyw.USER.openId === openId);
        this.pageTotal = Math.ceil(this.rankingData.length / this.pageSize);
        this.groupWorld.visible = true;
        this.drawRanking();
        // 渲染自己
        this.drawRankingItem(this.myRankingData, this.pageSize);
        this.initScroll();
      } catch (error) {
        yyw.showToast("当前无数据");
      }
    }

    /**
     * 创建排行榜
     */
    private drawRanking() {
      // 获取当前要渲染的数据组
      // 起始 id
      const startID = this.pageSize * this.pageIndex;
      const pageItems = this.rankingData.slice(startID, startID + this.pageSize);
      let n = this.pageSize - pageItems.length;
      while (n--) {
        pageItems.push(null);
      }
      // 创建 body
      pageItems.forEach((data, index) => {
        // 创建行
        this.drawRankingItem(data, index);
      });
    }

    /**
     * 根据绘制信息以及当前i绘制元素
     */
    private drawRankingItem(data: any, i: number) {
      const r: RankingItem = this[`r${i}`];
      r.setData(data);
    }

    private initScroll() {
      let startX: number = 0;
      let startY: number = 0;
      this.removeScroll = yyw.onDnd(this.groupWorld,
        (e: egret.TouchEvent, cancel: any) => {
          if (this.pageTotal <= 1) {
            cancel();
            return;
          }
          startX = e.stageX;
          startY = e.stageY;
        },
        (e: egret.TouchEvent) => {
          // nothing to do
        },
        (e: egret.TouchEvent) => {
          const dx = e.stageX - startX;
          const dy = e.stageY - startY;
          // 不使用 1 判断斜率，而留有余量，防止误触
          if (Math.abs(dy / dx) > 2) {
            this.goPage(dy > 0 ? -1 : 1);
          }
        },
      );
    }

    /**
     * -1 为上一页
     * 1 为下一页
     */
    private goPage(offset: number) {
      if (this.pageIndex === undefined) {
        return;
      }
      this.pageIndex += offset;
      if (this.pageIndex < 0) {
        this.pageIndex = 0;
        return;
      }
      if (this.pageIndex >= this.pageTotal) {
        this.pageIndex = this.pageTotal - 1;
        return;
      }
      this.drawRanking();
    }

    private removeFriend() {
      yyw.removeChildren(this.groupFriend);
      yyw.sub.postMessage({
        command: "closeRanking",
      });
    }

    private removeWorld() {
      this.groupWorld.visible = false;
      if (this.removeScroll) {
        this.removeScroll();
      }
    }
  }
}
