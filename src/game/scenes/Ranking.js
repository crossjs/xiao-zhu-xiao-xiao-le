var game;
(function (game) {
    class Ranking extends yyw.Base {
        constructor() {
            super(...arguments);
            this.pageSize = 5;
            this.pageIndex = 0;
        }
        destroy() {
            this.removeFriend();
            this.removeWorld();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.onTap(this.btnFriend, () => {
                    this.removeWorld();
                    this.showFriend();
                });
                yyw.onTap(this.btnWorld, () => {
                    this.removeFriend();
                    this.showWorld();
                });
            }
            this.showFriend();
        }
        showFriend() {
            this.hdrFriend.visible = true;
            this.btnWorld.visible = true;
            const { width, height } = this.groupFriend;
            const bmpFriend = yyw.sub.createDisplayObject(null, width, height);
            this.groupFriend.addChild(bmpFriend);
            yyw.sub.postMessage({
                command: "openRanking",
                width,
                height,
                openid: yyw.USER.openid || 0,
                pageSize: this.pageSize,
            });
            yyw.analysis.addEvent("7进入场景", { s: "好友排行" });
        }
        async showWorld() {
            this.hdrWorld.visible = true;
            this.btnFriend.visible = true;
            try {
                this.rankingData = await yyw.pbl.all();
                this.myRankingData = this.rankingData.find(({ openid }) => yyw.USER.openid === openid);
                this.pageTotal = Math.ceil(this.rankingData.length / this.pageSize);
                this.groupWorld.visible = true;
                this.drawRanking();
                this.drawRankingItem(this.myRankingData, this.pageSize);
                this.initScroll();
            }
            catch (error) {
                yyw.showToast("当前无数据");
            }
            yyw.analysis.addEvent("7进入场景", { s: "世界排行" });
        }
        drawRanking() {
            const startID = this.pageSize * this.pageIndex;
            const pageItems = this.rankingData.slice(startID, startID + this.pageSize);
            let n = this.pageSize - pageItems.length;
            while (n--) {
                pageItems.push(null);
            }
            pageItems.forEach((data, index) => {
                this.drawRankingItem(data, index);
            });
        }
        drawRankingItem(data, i) {
            const r = this[`r${i}`];
            r.setData(data);
        }
        initScroll() {
            let startX = 0;
            let startY = 0;
            if (this.offDnd) {
                this.offDnd();
            }
            this.offDnd = yyw.onDnd(this.groupWorld, (e, cancel) => {
                if (this.pageTotal <= 1) {
                    cancel();
                    return;
                }
                startX = e.stageX;
                startY = e.stageY;
            }, () => {
            }, (e) => {
                const dx = e.stageX - startX;
                const dy = e.stageY - startY;
                if (Math.abs(dy / dx) > 2) {
                    this.goPage(dy > 0 ? -1 : 1);
                }
            });
        }
        goPage(offset) {
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
        removeFriend() {
            this.hdrFriend.visible = false;
            this.btnWorld.visible = false;
            yyw.removeChildren(this.groupFriend);
            yyw.sub.postMessage({
                command: "closeRanking",
            });
        }
        removeWorld() {
            this.hdrWorld.visible = false;
            this.btnFriend.visible = false;
            this.groupWorld.visible = false;
            if (this.offDnd) {
                this.offDnd();
                this.offDnd = null;
            }
        }
    }
    game.Ranking = Ranking;
})(game || (game = {}));
