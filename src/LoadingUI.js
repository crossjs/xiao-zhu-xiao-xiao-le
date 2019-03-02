class LoadingUI extends yyw.Base {
    constructor() {
        super(...arguments);
        this.tips = [
            "合成「棒棒糖」可得「金币」",
            "直线五个数字可合成「棒棒糖」",
            "「金币」可兑换「道具」或「实物」",
        ];
        this.index = yyw.random(2);
    }
    onProgress(current, total) {
        if (this.initialized) {
            const percent = current / total;
            this.percent.text = `${Math.ceil(percent * 100)}%`;
            this.bar.width = Math.ceil(654 * percent);
        }
    }
    async createView(fromChildrenCreated) {
        super.createView(fromChildrenCreated);
        if (fromChildrenCreated) {
            let count = 0;
            const update = () => {
                this.tip.text = this.tips[this.index++ % this.tips.length];
                if (++count < 3) {
                    egret.setTimeout(update, null, 3000);
                }
            };
            update();
        }
    }
}
