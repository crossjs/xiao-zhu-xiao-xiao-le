namespace yyw {
  export class Stack {
    private stack: any[];
    private unique: boolean = false;

    constructor(unique: boolean = false) {
      this.stack = [];
      this.unique = unique;
    }

    public add(value: any): void {
      if (this.unique) {
        const index = this.findIndex(value);
        if (index !== -1) {
          this.stack.splice(index, 0, value);
          return;
        }
      }
      this.stack.push(value);
    }

    public pop(): any {
      return this.stack.pop();
    }

    private findIndex(value: any): number {
      return this.stack.indexOf(value);
    }
  }
}
