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
     * “佩服”声效
     */
    var AmazingSound = /** @class */ (function (_super) {
        __extends(AmazingSound, _super);
        function AmazingSound() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.url = yyw.CONFIG.serverOrigin + "/file/amazing.m4a";
            return _this;
        }
        return AmazingSound;
    }(yyw.Sound));
    game.AmazingSound = AmazingSound;
})(game || (game = {}));
