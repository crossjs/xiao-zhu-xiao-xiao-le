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
    var Shuffle = /** @class */ (function (_super) {
        __extends(Shuffle, _super);
        function Shuffle() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = "shuffle";
            _this.message = "获得道具：重新排列数字";
            return _this;
        }
        return Shuffle;
    }(game.ToolBase));
    game.Shuffle = Shuffle;
})(game || (game = {}));
