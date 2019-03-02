var yyw;
(function (yyw) {
    const hi = () => {
        yyw.vibrateShort();
        playClickSound();
    };
    let playClickSound = () => void 0;
    function setClick(playSound) {
        playClickSound = playSound;
    }
    yyw.setClick = setClick;
    function onTap(target, handler, { priority = 0, mute = false, useCapture = false, } = {}) {
        if (!mute) {
            target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, hi, target, useCapture, priority);
        }
        target.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, target, useCapture, priority);
        return () => {
            if (!mute) {
                target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, hi, target);
            }
            target.removeEventListener(egret.TouchEvent.TOUCH_TAP, handler, target);
        };
    }
    yyw.onTap = onTap;
    function onDnd(target, begin, move, end, stage) {
        let dragging = false;
        const cancel = () => {
            dragging = false;
        };
        const handleBegin = (e) => {
            dragging = true;
            begin(e, cancel);
        };
        const handleMove = (e) => {
            if (!dragging) {
                return;
            }
            move(e, cancel);
        };
        const handleEnd = (e) => {
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
        return () => {
            target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, handleBegin, target);
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, handleMove, target);
            target.removeEventListener(egret.TouchEvent.TOUCH_END, handleEnd, target);
            target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, handleEnd, target);
        };
    }
    yyw.onDnd = onDnd;
})(yyw || (yyw = {}));
