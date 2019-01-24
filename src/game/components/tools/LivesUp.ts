namespace game {
  export class LivesUp extends ToolBase {
    public type: string = "livesUp";
    protected message: string = "获得道具：体力+1";

    /**
     * 体力获得后直接消费
     */
    protected afterGet() {
      this.dispatchEventWith("USING", false, {
        type: this.type,
        confirm: () => {
          this.increaseNum(-1);
        },
        cancel: () => {
          super.afterGet();
        },
      });
    }
  }
}
