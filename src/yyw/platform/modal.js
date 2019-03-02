var yyw;
(function (yyw) {
    function showModal(content) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: "",
                content,
                success: ({ confirm, cancel }) => {
                    if (confirm) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                },
                fail: () => {
                    resolve(false);
                },
            });
        });
    }
    yyw.showModal = showModal;
    function showToast(title) {
        wx.showToast({
            title,
            icon: "none",
        });
    }
    yyw.showToast = showToast;
})(yyw || (yyw = {}));
