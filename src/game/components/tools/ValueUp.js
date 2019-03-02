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
    var ValueUp = /** @class */ (function (_super) {
        __extends(ValueUp, _super);
        function ValueUp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = "valueUp";
            _this.message = "获得道具：数字+1";
            _this.dnd = true;
            return _this;
        }
        return ValueUp;
    }(game.ToolBase));
    game.ValueUp = ValueUp;
})(game || (game = {}));
