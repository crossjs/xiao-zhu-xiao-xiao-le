var game;
(function (game) {
    class ToolBase extends yyw.Base {
        constructor() {
            super(...arguments);
            this.amount = 0;
            this.message = "获得道具";
            this.dnd = false;
        }
        set targetRect(targetRect) {
            this.rect = targetRect;
        }
        setAmount(amount) {
            this.amount = amount;
            this.update();
        }
        getAmount() {
            return this.amount;
        }
        increaseAmount(amount) {
            this.amount += amount;
            if (amount > 0) {
                yyw.emit("TOOL_USED", {
                    type: this.type,
                    amount,
                });
            }
            this.update();
        }
        destroy() {
            yyw.removeTweens(this.main);
        }
        afterGet(amount) {
            yyw.showToast(this.message);
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.on("TOOL_GOT", ({ data: { type, amount } }) => {
                    if (type === this.type) {
                        this.increaseAmount(amount);
                        this.afterGet(amount);
                    }
                });
                yyw.onTap(this, async () => {
                    this.zoomOut();
                    if (!this.amount) {
                        this.enabled = false;
                        if (await yyw.reward.apply("tool")) {
                            this.increaseAmount(1);
                            this.afterGet(1);
                        }
                        this.enabled = true;
                        return;
                    }
                    if (!this.dnd) {
                        yyw.emit("TOOL_USING", {
                            type: this.type,
                            confirm: () => {
                                this.increaseAmount(-1);
                            },
                        });
                        return;
                    }
                });
                if (this.dnd) {
                    const { x, y } = this;
                    const zIndex = yyw.getZIndex(this);
                    let startX;
                    let startY;
                    let targetXY = null;
                    yyw.onDnd(this, (e, cancel) => {
                        if (!this.amount) {
                            cancel();
                            return;
                        }
                        startX = e.stageX;
                        startY = e.stageY;
                        yyw.setZIndex(this);
                        this.zoomIn();
                    }, (e, cancel) => {
                        const { stageX, stageY } = e;
                        this.x = x + (stageX - startX);
                        this.y = y + (stageY - startY);
                        if (this.rect.contains(stageX, stageY)) {
                            targetXY = {
                                targetX: stageX - this.rect.x,
                                targetY: stageY - this.rect.y,
                            };
                            yyw.emit("TOOL_USING", Object.assign({ type: this.type }, targetXY, { cancel }));
                        }
                        else {
                            targetXY = null;
                        }
                    }, async () => {
                        const reset = async () => {
                            await this.zoomOut();
                            await yyw.getTween(this).to({
                                x,
                                y,
                            }, 500);
                            yyw.setZIndex(this, zIndex);
                        };
                        if (targetXY) {
                            yyw.emit("TOOL_USING", Object.assign({ type: this.type }, targetXY, { confirm: async () => {
                                    await reset();
                                    this.increaseAmount(-1);
                                } }));
                            targetXY = null;
                        }
                        else {
                            yyw.showToast("请拖放到棋盘中");
                            await reset();
                        }
                    });
                }
            }
        }
        update() {
            const { tfd, img, amount } = this;
            tfd.text = `${amount}`;
            if (yyw.reward.can("tool")) {
                img.visible = !amount;
            }
        }
        zoomIn() {
            yyw.getTween(this.main).to({
                scale: 1.2,
            });
        }
        zoomOut() {
            yyw.getTween(this.main).to({
                scale: 1,
            });
        }
    }
    game.ToolBase = ToolBase;
})(game || (game = {}));
