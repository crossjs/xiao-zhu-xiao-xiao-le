namespace game {
  export class StepsUp extends ToolBase {
    public type: string = "stepsUp";
    protected message: string = "获得道具：剩余步数+1";

    /**
     * 剩余步数获得后直接消费
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
