var yyw;
(function (yyw) {
    var hi = function () {
        yyw.vibrateShort();
        playClickSound();
    };
    var playClickSound = function () { return void 0; };
    function setClick(playSound) {
        playClickSound = playSound;
    }
    yyw.setClick = setClick;
    function onTap(target, handler, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.priority, priority = _c === void 0 ? 0 : _c, _d = _b.mute, mute = _d === void 0 ? false : _d, _e = _b.useCapture, useCapture = _e === void 0 ? false : _e;
        if (!mute) {
            target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, hi, target, useCapture, priority);
        }
        target.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, target, useCapture, priority);
        return function () {
            if (!mute) {
                target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, hi, target);
            }
            target.removeEventListener(egret.TouchEvent.TOUCH_TAP, handler, target);
        };
    }
    yyw.onTap = onTap;
    function onDnd(target, begin, move, end, stage) {
        // 是否正在拖动
        var dragging = false;
        var cancel = function () {
            dragging = false;
        };
        var handleBegin = function (e) {
            dragging = true;
            begin(e, cancel);
        };
        var handleMove = function (e) {
            if (!dragging) {
                return;
            }
            move(e, cancel);
        };
        var handleEnd = function (e) {
            if (!dragging) {
                return;
            }
            cancel();
            end(e);
        };
        if (!stage) {
            stage = target;
        }
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, handleBegin, target);
        stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, handleMove, target);
        target.addEventListener(egret.TouchEvent.TOUCH_END, handleEnd, target);
        target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, handleEnd, target);
        return function () {
            target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, handleBegin, target);
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, handleMove, target);
            target.removeEventListener(egret.TouchEvent.TOUCH_END, handleEnd, target);
            target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, handleEnd, target);
        };
    }
    yyw.onDnd = onDnd;
})(yyw || (yyw = {}));
