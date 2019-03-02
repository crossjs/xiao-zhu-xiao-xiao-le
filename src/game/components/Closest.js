var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var game;
(function (game) {
    class Closest extends yyw.Base {
        async initialize() {
            yyw.on("SCENE_ENTERING", ({ data: { name } }) => {
                if (name === "reviving" || name === "ranking") {
                    this.removeBmp();
                }
            });
            yyw.on("SCENE_ESCAPED", ({ data: { name } }) => {
                if (name === "reviving" || name === "ranking") {
                    egret.setTimeout(this.createBmp, this, 500);
                }
            });
        }
        destroy() {
            this.removeBmp();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.on("GAME_DATA", ({ data: { score } }) => {
                    this.update(score);
                });
            }
            this.createBmp();
        }
        update(score) {
            if (!this.bmpClosest) {
                return;
            }
            yyw.sub.postMessage({
                command: "openClosest",
                score,
                width: this.width,
                height: this.height,
                openid: yyw.USER.openid || 0,
            });
        }
        createBmp() {
            if (!this.bmpClosest) {
                this.bmpClosest = yyw.sub.createDisplayObject(null, this.width, this.height);
                this.addChild(this.bmpClosest);
            }
        }
        removeBmp() {
            yyw.removeElement(this.bmpClosest);
            this.bmpClosest = null;
            yyw.sub.postMessage({
                command: "closeClosest",
            });
        }
    }
    __decorate([
        yyw.debounce()
    ], Closest.prototype, "update", null);
    game.Closest = Closest;
})(game || (game = {}));
