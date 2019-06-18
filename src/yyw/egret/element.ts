namespace yyw {
  export function removeChildren(container: egret.DisplayObjectContainer) {
    if (container) {
      let n = container.numChildren;
      while (n--) {
        container.removeChildAt(n);
      }
    }
  }

  export function removeElement(target: any): boolean {
    if (target) {
      const { parent } = target;
      if (parent) {
        parent.removeChild(target);
        return true;
      }
    }
    return false;
  }

  export function getZIndex(target: egret.DisplayObject) {
    if (target) {
      const { parent } = target;
      if (parent) {
        return parent.getChildIndex(target);
      }
    }
    return -1;
  }

  export function setZIndex(target: egret.DisplayObject, zIndex?: number) {
    if (target) {
      const { parent } = target;
      if (parent) {
        parent.setChildIndex(target, zIndex === undefined ? parent.numChildren : zIndex);
      }
    }
  }

  export function eachChild(
    target: egret.DisplayObjectContainer,
    handler: (child: egret.DisplayObject, index: number) => any,
  ): any[] {
    const arr = [];
    if (target) {
      const { numChildren } = target;
      if (numChildren) {
        for (let index = 0; index < numChildren; index++) {
          const child = target.getChildAt(index);
          arr.push(handler(child, index));
        }
      }
    }
    return arr;
  }

  export function randomChild(target: egret.DisplayObjectContainer): any {
    if (target) {
      const { numChildren } = target;
      if (numChildren) {
        return target.getChildAt(random(numChildren));
      }
    }
  }
}
