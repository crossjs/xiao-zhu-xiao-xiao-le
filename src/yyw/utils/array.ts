namespace yyw {
  export class Stack {
    private stack: any[];

    constructor(private unique: boolean = false) {
      this.stack = [];
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

  export function arr2obj(arr: any[], key: string) {
    return arr.reduce((o, v) => {
      return Object.assign(o, {
        [v[key]]: v,
      });
    }, {});
  }
}
