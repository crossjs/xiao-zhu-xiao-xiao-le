namespace game {
  export class Arena extends eui.Component implements eui.UIComponent {
    private words: Words;

    private createWordsView() {
      this.words = new Words();
      this.addChild(this.words);
    }
  }
}
