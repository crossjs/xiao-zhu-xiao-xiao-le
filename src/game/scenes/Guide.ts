namespace game {
  export class Guide extends yyw.Base {
    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);
      if (fromChildrenCreated) {
        yyw.onTap(this.bg, () => {
          SceneManager.escape();
        });
      }
    }
  }
}
