var yyw;
(function (yyw) {
    class PromisedTween {
        constructor(target, loop = false) {
            this.tween = egret.Tween.get(target, {
                loop,
            });
        }
        to(props, duration = 100, ease = egret.Ease.quadOut) {
            return new Promise((resolve) => {
                this.tween.setPaused(false).to(props, duration * yyw.CONFIG.speedRatio, ease).call(resolve);
            });
        }
    }
    function removeAllTweens() {
        egret.Tween.removeAllTweens();
    }
    yyw.removeAllTweens = removeAllTweens;
    function pauseTweens(target) {
        egret.Tween.pauseTweens(target);
    }
    yyw.pauseTweens = pauseTweens;
    function resumeTweens(target) {
        egret.Tween.resumeTweens(target);
    }
    yyw.resumeTweens = resumeTweens;
    function removeTweens(target) {
        egret.Tween.removeTweens(target);
    }
    yyw.removeTweens = removeTweens;
    function getTween(target, loop = false) {
        return new PromisedTween(target, loop);
    }
    yyw.getTween = getTween;
    async function fadeIn(target, duration, ease) {
        target.alpha = 0;
        target.visible = true;
        await getTween(target).to({
            alpha: 1,
        }, duration, ease);
    }
    yyw.fadeIn = fadeIn;
    async function fadeOut(target, duration, ease) {
        await getTween(target)
            .to({
            alpha: 0,
        }, duration, ease);
        target.visible = false;
        target.alpha = 1;
    }
    yyw.fadeOut = fadeOut;
    async function zoomIn(target, duration, ease) {
        target.alpha = 0;
        target.scale = 0;
        target.visible = true;
        await getTween(target).to({
            alpha: 1,
            scale: 1,
        }, duration, ease);
    }
    yyw.zoomIn = zoomIn;
    async function zoomOut(target, duration, ease) {
        await getTween(target)
            .to({
            alpha: 0,
            scale: 0,
        }, duration, ease);
        target.visible = false;
        target.alpha = 1;
        target.scale = 1;
    }
    yyw.zoomOut = zoomOut;
    async function twirlIn(target, duration, ease) {
        target.alpha = 0;
        target.scale = 0;
        target.rotation = 0;
        target.visible = true;
        await getTween(target).to({
            alpha: 1,
            scale: 1,
            rotation: 1080,
        }, duration, ease);
    }
    yyw.twirlIn = twirlIn;
    async function twirlOut(target, duration, ease) {
        await getTween(target)
            .to({
            alpha: 0,
            scale: 0,
            rotation: -1080,
        }, duration, ease);
        target.visible = false;
        target.alpha = 1;
        target.scale = 1;
        target.rotation = 0;
    }
    yyw.twirlOut = twirlOut;
})(yyw || (yyw = {}));
