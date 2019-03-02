var game;
(function (game) {
    class TaskItem extends yyw.Base {
        async setData(data) {
            this.tfdDesc.text = data.description;
            this.tfdCoins.text = data.coins;
            this.btnChecked.enabled = data.fulfilled;
        }
    }
    game.TaskItem = TaskItem;
})(game || (game = {}));
