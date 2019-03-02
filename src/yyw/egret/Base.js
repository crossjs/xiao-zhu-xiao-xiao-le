var yyw;
(function (yyw) {
    class Base extends eui.Component {
        constructor() {
            super();
            this.initialized = false;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
                if (this.initialized) {
                    this.createView(false);
                }
            }, null);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
                this.destroy();
            }, null);
            this.initialize();
        }
        async exiting() {
            await yyw.fadeOut(this);
        }
        async entering() {
            await yyw.fadeIn(this);
        }
        initialize() {
        }
        destroy() {
        }
        async createView(fromChildrenCreated) {
            if (fromChildrenCreated) {
                this.initialized = true;
            }
        }
        childrenCreated() {
            super.childrenCreated();
            if (this.bg) {
                this.bg.height = this.stage.stageHeight;
                yyw.onTap(this.bg, (e) => {
                    e.stopPropagation();
                }, { mute: true, priority: -1 });
            }
            if (this.btnEscape) {
                yyw.onTap(this.btnEscape, () => {
                    yyw.director.escape();
                }, { priority: -1 });
            }
            this.createView(true);
        }
    }
    yyw.Base = Base;
})(yyw || (yyw = {}));
