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
          this.labelKey.visible = false;
          this.imageKey.source = `sprites_json.top${key}`;
          this.imageKey.visible = true;
        } else {
          this.imageKey.visible = false;
          this.labelKey.text = `${key}`;
          this.labelKey.visible = true;
        }
        const avatar: egret.Bitmap = await yyw.loadImage(avatarUrl);
        this.imageAvatar.source = avatar.texture;
        this.labelNickname.text = yyw.sliceString(nickName);
        this.labelScore.text = `${score}`;
      }
    }
  }
}
