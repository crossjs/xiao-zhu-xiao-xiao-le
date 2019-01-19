namespace yyw {
  export function removeFromStage(target: any) {
    if (target) {
      const { parent } = target;
      if (parent) {
        parent.removeChild(target);
      }
    }
  }
}
