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
     * 获得金币声效
     */
    var CoinsSound = /** @class */ (function (_super) {
        __extends(CoinsSound, _super);
        function CoinsSound() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.url = yyw.CONFIG.serverOrigin + "/file/coins.m4a";
            return _this;
        }
        return CoinsSound;
    }(yyw.Sound));
    game.CoinsSound = CoinsSound;
})(game || (game = {}));
