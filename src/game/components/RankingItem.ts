namespace game {
  export class RankingItem extends yyw.Base {
    private labelKey: eui.Label;
    private imageKey: eui.Image;
    private imageAvatar: eui.Image;
    private labelNickname: eui.Label;
    private labelScore: eui.Label;

    public async setData(data: any) {
      yyw.eachChild(this, (child) => {
        child.visible = !!data;
      });
      if (data) {
        const { key, avatarUrl, nickName, score } = data;
        if (key < 4) {
          this.imageKey.source = `sprites_json.top${key}`;
        }
        this.imageKey.visible = key < 4;
        this.labelKey.text = `${key}`;
        this.labelKey.y = key < 4 ? 16 : 8;
        const avatar: egret.Bitmap = await yyw.loadImage(avatarUrl);
        this.imageAvatar.source = avatar.texture;
        this.labelNickname.text = yyw.sliceString(nickName);
        this.labelScore.text = `${score}`;
      }
    }
  }
}
