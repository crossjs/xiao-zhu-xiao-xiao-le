var game;
(function (game) {
    class Cell extends yyw.Base {
        constructor(col, row, width, height, num = 0) {
            super();
            this.ax = 0;
            this.ay = 0;
            this.num = 0;
            this.num = num;
            this.ax = width / 2;
            this.ay = height / 2;
            this.x = col * width + this.ax;
            this.y = row * height + this.ay;
            this.anchorOffsetX = this.ax;
            this.anchorOffsetY = this.ay;
        }
        setNumber(num) {
            if (num === this.num) {
                return;
            }
            if (this.numImage) {
                this.numImage.visible = false;
            }
            this.num = num;
            this.showCurrent();
        }
        getNumber() {
            return this.num;
        }
        async flashScore() {
            this.tfdScore.text = `+${this.num * 10}`;
            this.tfdScore.visible = true;
            this.tfdScore.alpha = 0;
            const tween = await yyw.getTween(this.tfdScore);
            await tween.to({
                y: 72,
                alpha: 1,
            }, 300);
            await tween.to({
                y: 36,
                alpha: 0,
                scaleX: 1.5,
                scaleY: 1.5,
            }, 200);
            this.tfdScore.visible = false;
            this.tfdScore.alpha = 1;
            this.tfdScore.y = 108;
            this.tfdScore.scaleX = 1;
            this.tfdScore.scaleY = 1;
        }
        async tweenUp(duration = 300) {
            const { numImage } = this;
            await yyw.fadeOut(numImage, duration);
            numImage.source = `numbers_json.${this.num === game.BIGGEST_NUMBER ? game.MAGIC_NUMBER : this.num + 1}`;
            await yyw.fadeIn(numImage, duration);
        }
        zoomOut(duration = 100) {
            yyw.removeTweens(this);
            return yyw.getTween(this)
                .to({
                scale: 1,
            }, duration);
        }
        zoomIn(duration = 100) {
            yyw.removeTweens(this);
            return yyw.getTween(this)
                .to({
                scale: 1.2,
            }, duration);
        }
        async tweenTo(increases, duration, onResolve) {
            const { numGroup } = this;
            const { x: oX, y: oY, rotation: oRotation, alpha: oAlpha } = numGroup;
            const tween = yyw.getTween(numGroup);
            duration /= increases.length;
            let tX = oX;
            let tY = oY;
            let tRotation = oRotation;
            let tAlpha = oAlpha;
            for (const { x = 0, y = 0, rotation = 0, alpha = 0 } of increases) {
                tX += x;
                tY += y;
                tRotation += rotation;
                tAlpha += alpha;
                await tween.to({
                    x: tX,
                    y: tY,
                    rotation: tRotation,
                    alpha: tAlpha,
                }, duration);
            }
            if (typeof onResolve === "function") {
                await onResolve();
            }
            numGroup.x = oX;
            numGroup.y = oY;
            numGroup.rotation = oRotation;
            numGroup.alpha = oAlpha;
        }
        async fadeOut(duration = 300) {
            await yyw.getTween(this.numGroup)
                .to({
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                rotation: 1080,
            }, duration);
        }
        async fadeIn(duration = 200) {
            await yyw.getTween(this.numGroup)
                .to({
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                rotation: 0,
            }, duration);
        }
        reset() {
            yyw.removeTweens(this);
            this.scaleX = this.scaleY = 1;
            yyw.removeTweens(this.tfdScore);
            yyw.removeTweens(this.numGroup);
            yyw.removeTweens(this.numImage);
            this.tfdScore.visible = false;
            this.tfdScore.alpha = 1;
            this.tfdScore.y = 36;
            this.numGroup.scaleX = this.numGroup.scaleY = this.numGroup.alpha = 1;
            this.numGroup.rotation = 0;
        }
        destroy() {
            this.reset();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                this.numGroup.x
                    = this.numGroup.anchorOffsetX
                        = this.ax;
                this.numGroup.y
                    = this.numGroup.anchorOffsetY
                        = this.ay;
            }
            this.showCurrent();
        }
        showCurrent() {
            if (this.num) {
                this.numImage.source = `numbers_json.${this.num}`;
                this.numImage.visible = true;
            }
            yyw.removeTweens(this.sugar);
            if (game.MAGIC_NUMBER === this.num) {
                this.sugar.rotation = 0;
                yyw.getTween(this.sugar, true)
                    .to({
                    rotation: 360,
                }, 1000, null);
                this.sugar.visible = true;
            }
            else {
                this.sugar.visible = false;
            }
        }
    }
    game.Cell = Cell;
})(game || (game = {}));
