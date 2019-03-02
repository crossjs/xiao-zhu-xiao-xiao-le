var game;
(function (game) {
    class Landing extends yyw.Base {
        constructor() {
            super(...arguments);
            this.duration = 500;
        }
        async exiting() {
            yyw.getTween(this.pig).to({
                x: this.pig.x + 90,
                y: this.pig.y + 60,
            }, this.duration);
            yyw.getTween(this.numbers).to({
                x: this.numbers.x - 60,
                y: this.numbers.y - 30,
            }, this.duration);
            await yyw.fadeOut(this);
        }
        async entering() {
            yyw.getTween(this.pig).to({
                x: this.pig.x - 90,
                y: this.pig.y - 60,
            }, this.duration);
            yyw.getTween(this.numbers).to({
                x: this.numbers.x + 60,
                y: this.numbers.y + 30,
            }, this.duration);
            await yyw.fadeIn(this);
        }
        destroy() {
            if (this.userInfoButton) {
                this.userInfoButton.destroy();
            }
            if (this.offLight) {
                this.offLight();
            }
            if (this.offWave) {
                this.offWave();
            }
            yyw.removeElement(this.boxAll);
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                const { x: left, y: top, width, height } = this.btnStart;
                this.userInfoButton = await yyw.createUserInfoButton({
                    left,
                    top: this.stage.stageHeight - 1334 + top,
                    width,
                    height,
                    onTap: (authorized) => {
                        yyw.analysis.addEvent(authorized ? "5确认授权" : "5取消授权");
                        yyw.director.toScene("playing");
                    },
                });
                this.tfdVersion.text = VERSION;
                yyw.onTap(this.btnStart, () => {
                    yyw.director.toScene("playing");
                });
                const STICKY_KEY = "STICKY_ENTRY";
                if (!(await yyw.db.get(STICKY_KEY))) {
                    if (yyw.CONFIG.launchOptions.scene === 1104) {
                        yyw.db.set(STICKY_KEY, true);
                        yyw.award.save({ coins: 1000 });
                        yyw.showToast("获得奖励：1000 金币！");
                    }
                    else {
                        this.favorite.visible = true;
                    }
                }
            }
            this.offLight = yyw.light(this.bg);
            this.offWave = yyw.wave(this.pig);
            const { score = 0 } = await yyw.pbl.me();
            this.tfdBestScore.text = `历史最高分数：${score}`;
            if (!await yyw.showBannerAd()) {
                this.boxAll = new box.All();
                this.boxAll.bottom = 0;
                this.addChild(this.boxAll);
            }
            yyw.analysis.addEvent("7进入场景", { s: "主界面" });
        }
    }
    game.Landing = Landing;
})(game || (game = {}));
