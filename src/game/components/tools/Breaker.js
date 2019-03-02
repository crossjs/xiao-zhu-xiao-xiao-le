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
    var Breaker = /** @class */ (function (_super) {
        __extends(Breaker, _super);
        function Breaker() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = "breaker";
            _this.message = "获得道具：击碎指定数字";
            _this.dnd = true;
            return _this;
        }
        return Breaker;
    }(game.ToolBase));
    game.Breaker = Breaker;
})(game || (game = {}));
