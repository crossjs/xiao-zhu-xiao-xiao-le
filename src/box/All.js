var box;
(function (box) {
    class All extends yyw.Base {
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                box.onReady((_, recommender) => {
                    const bg = new eui.Image("sprites_json.bottom_bg");
                    bg.scale9Grid = new egret.Rectangle(10, 10, 10, 10);
                    bg.width = this.width;
                    bg.height = this.height;
                    this.addChildAt(bg, 0);
                    const games = recommender.getGames();
                    games.forEach(async (game, index) => {
                        const { iconUrl, title } = game;
                        const group = new eui.Group();
                        group.touchEnabled = true;
                        group.width = 168;
                        group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                            recommender.navigateTo(game);
                        }, this);
                        const icon = await yyw.loadImage(iconUrl);
                        icon.x = 24;
                        icon.y = 12;
                        icon.width = 120;
                        icon.height = 120;
                        const rect = new eui.Rect(120, 120);
                        rect.x = 24;
                        rect.y = 12;
                        rect.ellipseWidth = 20;
                        rect.ellipseHeight = 20;
                        const textureAlert = await RES.getResAsync("sprites_json.important");
                        const important = new egret.Bitmap(textureAlert);
                        important.x = 126;
                        important.y = 3;
                        const label = new eui.Label(yyw.sliceString(title));
                        label.width = 168;
                        label.textAlign = "center";
                        label.y = 140;
                        label.size = 24;
                        label.textColor = 0x000000;
                        group.addChild(icon);
                        group.addChild(rect);
                        group.addChild(important);
                        group.addChild(label);
                        icon.mask = rect;
                        this.container.addChild(group);
                    });
                });
            }
        }
    }
    box.All = All;
})(box || (box = {}));
