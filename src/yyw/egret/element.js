var yyw;
(function (yyw) {
    function removeChildren(container) {
        if (container) {
            var n = container.numChildren;
            while (n--) {
                container.removeChildAt(n);
            }
        }
    }
    yyw.removeChildren = removeChildren;
    function removeElement(target) {
        if (target) {
            var parent_1 = target.parent;
            if (parent_1) {
                parent_1.removeChild(target);
            }
        }
    }
    yyw.removeElement = removeElement;
    function getZIndex(target) {
        if (target) {
            var parent_2 = target.parent;
            if (parent_2) {
                return parent_2.getChildIndex(target);
            }
        }
        return -1;
    }
    yyw.getZIndex = getZIndex;
    function setZIndex(target, zIndex) {
        if (target) {
            var parent_3 = target.parent;
            if (parent_3) {
                parent_3.setChildIndex(target, zIndex === undefined ? parent_3.numChildren : zIndex);
            }
        }
    }
    yyw.setZIndex = setZIndex;
    function eachChild(target, handler) {
        if (target) {
            var numChildren = target.numChildren;
            if (numChildren) {
                for (var index = 0; index < numChildren; index++) {
                    var child = target.getChildAt(index);
                    handler(child, index);
                }
            }
        }
    }
    yyw.eachChild = eachChild;
    function randomChild(target) {
        if (target) {
            var numChildren = target.numChildren;
            if (numChildren) {
                return target.getChildAt(yyw.random(numChildren));
            }
        }
    }
    yyw.randomChild = randomChild;
})(yyw || (yyw = {}));
