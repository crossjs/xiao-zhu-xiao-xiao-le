var yyw;
(function (yyw) {
    function removeChildren(container) {
        if (container) {
            let n = container.numChildren;
            while (n--) {
                container.removeChildAt(n);
            }
        }
    }
    yyw.removeChildren = removeChildren;
    function removeElement(target) {
        if (target) {
            const { parent } = target;
            if (parent) {
                parent.removeChild(target);
            }
        }
    }
    yyw.removeElement = removeElement;
    function getZIndex(target) {
        if (target) {
            const { parent } = target;
            if (parent) {
                return parent.getChildIndex(target);
            }
        }
        return -1;
    }
    yyw.getZIndex = getZIndex;
    function setZIndex(target, zIndex) {
        if (target) {
            const { parent } = target;
            if (parent) {
                parent.setChildIndex(target, zIndex === undefined ? parent.numChildren : zIndex);
            }
        }
    }
    yyw.setZIndex = setZIndex;
    function eachChild(target, handler) {
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
    yyw.eachChild = eachChild;
    function randomChild(target) {
        if (target) {
            const { numChildren } = target;
            if (numChildren) {
                return target.getChildAt(yyw.random(numChildren));
            }
        }
    }
    yyw.randomChild = randomChild;
})(yyw || (yyw = {}));
