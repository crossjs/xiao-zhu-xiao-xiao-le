namespace game {
  export class LivesUp extends ToolBase {
    public type: string = "livesUp";
    protected message: string = "获得道具：体力+1";

    /**
     * 体力获得后直接消费
     */
    protected afterGet(amount: number) {
      yyw.emit("TOOL_USING", {
        type: this.type,
        amount,
        confirm: () => {
          this.increaseAmount(-amount);
        },
        cancel: () => {
          super.afterGet(amount);
        },
      });
    }
  }
}
