namespace game {
  export class Breaker extends ToolBase {
    public type: string = "breaker";
    protected message: string = "获得道具：击碎指定数字";
    protected dnd: boolean = true;
  }
}
