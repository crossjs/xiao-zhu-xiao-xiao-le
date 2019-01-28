namespace yyw {
  export function removeChild(target: any) {
    if (target) {
      const { parent } = target;
      if (parent) {
        parent.removeChild(target);
      }
    }
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

  export function eachChild(target: egret.DisplayObjectContainer, handler: any) {
    if (target) {
      const { numChildren } = target;
      if (numChildren) {
        for (let index = 0; index < numChildren; index++) {
          const child = target.getChildAt(index);
          handler(child, index);
        }
      }
    }
  }

  export function randomChild(target: egret.DisplayObjectContainer): any {
    if (target) {
      const { numChildren } = target;
      if (numChildren) {
        return target.getChildAt(Math.floor( Math.random() * numChildren));
      }
    }
  }
}
