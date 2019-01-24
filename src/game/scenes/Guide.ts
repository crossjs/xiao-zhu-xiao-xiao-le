namespace game {
  export class Guide extends yyw.Base {
    protected destroy(): void {
      // empty
    }

    protected createView(fromChildrenCreated?: boolean): void {
      if (fromChildrenCreated) {
        yyw.onTap(this.bg, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }
  }
}
