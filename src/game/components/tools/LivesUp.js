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
    var LivesUp = /** @class */ (function (_super) {
        __extends(LivesUp, _super);
        function LivesUp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = "livesUp";
            _this.message = "获得道具：体力+1";
            return _this;
        }
        /**
         * 体力获得后直接消费
         */
        LivesUp.prototype.afterGet = function (amount) {
            var _this = this;
            yyw.emit("TOOL_USING", {
                type: this.type,
                confirm: function () {
                    _this.increaseAmount(-amount);
                },
                cancel: function () {
                    _super.prototype.afterGet.call(_this, amount);
                },
            });
        };
        return LivesUp;
    }(game.ToolBase));
    game.LivesUp = LivesUp;
})(game || (game = {}));
