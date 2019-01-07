namespace yyw {
  export class Set {
    private store: any[];

    constructor() {
      this.store = [];
    }

    public add(value: any) {
      if (this.store.indexOf(value) === -1) {
        this.store.push(value);
      }
    }

    public del(value: any) {
      const index = this.store.indexOf(value);
      if (index !== -1) {
        this.store.splice(index, 1);
      }
    }

    public each(cb: (value: any) => any) {
      this.store.forEach(cb);
    }
  }
}
