var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    /**
     * 切换声效
     */
    var SwapSound = /** @class */ (function (_super) {
        __extends(SwapSound, _super);
        function SwapSound() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.url = yyw.CONFIG.serverOrigin + "/file/swap.m4a";
            return _this;
        }
        return SwapSound;
    }(yyw.Sound));
    game.SwapSound = SwapSound;
})(game || (game = {}));
