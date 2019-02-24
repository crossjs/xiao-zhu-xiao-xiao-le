namespace game {
  export class TaskItem extends yyw.Base {
    private tfdDesc: eui.Label;
    private tfdCoins: eui.Label;
    private btnChecked: eui.Button;

    public async setData(data: any) {
      this.tfdDesc.text = data.description;
      this.tfdCoins.text = data.coins;
      this.btnChecked.enabled = data.fulfilled;
    }
  }
}
