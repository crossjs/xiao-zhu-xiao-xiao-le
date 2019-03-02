var yyw;
(function (yyw) {
    function showModal(content) {
        return new Promise(function (resolve, reject) {
            wx.showModal({
                title: "",
                content: content,
                success: function (_a) {
                    var confirm = _a.confirm, cancel = _a.cancel;
                    if (confirm) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                },
                fail: function () {
                    resolve(false);
                },
            });
        });
    }
    yyw.showModal = showModal;
    function showToast(title) {
        wx.showToast({
            title: title,
            icon: "none",
        });
    }
    yyw.showToast = showToast;
})(yyw || (yyw = {}));
