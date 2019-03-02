var game;
(function (game) {
    class RankingItem extends yyw.Base {
        async setData(data) {
            yyw.eachChild(this, (child) => {
                child.visible = !!data;
            });
            if (data) {
                const { key, avatarUrl, nickName, score } = data;
                if (key < 4) {
                    this.labelKey.visible = false;
                    this.imageKey.source = `sprites_json.top${key}`;
                    this.imageKey.visible = true;
                }
                else {
                    this.imageKey.visible = false;
                    this.labelKey.text = `${key}`;
                    this.labelKey.visible = true;
                }
                const avatar = await yyw.loadImage(avatarUrl);
                this.imageAvatar.source = avatar.texture;
                this.labelNickname.text = yyw.sliceString(nickName);
                this.labelScore.text = `${score}`;
            }
        }
    }
    game.RankingItem = RankingItem;
})(game || (game = {}));
