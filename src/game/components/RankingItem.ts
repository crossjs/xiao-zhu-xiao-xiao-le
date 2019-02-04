namespace game {
  export class RankingItem extends yyw.Base {
    private groupTop: eui.Group;
    private labelKey: eui.Label;
    private imageAvatar: eui.Image;
    private labelNickname: eui.Label;
    private labelScore: eui.Label;

    public async setData(data: any) {
      yyw.eachChild(this, (child) => {
        child.visible = !!data;
      });
      if (data) {
        const { key, avatarUrl, nickname, score } = data;
        if (key < 4) {
          this.labelKey.visible = false;
          this.groupTop.visible = true;
          yyw.eachChild(this.groupTop, (child: eui.Image, index: number) => {
            child.visible = index + 1 === key;
          });
        } else {
          this.groupTop.visible = false;
          this.labelKey.visible = true;
          this.labelKey.text = `${key}`;
        }
        const avatar: egret.Bitmap = await yyw.RemoteLoader.loadImage(avatarUrl);
        this.imageAvatar.source = avatar.texture;
        this.labelNickname.text = yyw.sliceString(nickname);
        this.labelScore.text = `${score}`;
      }
    }
  }
}
