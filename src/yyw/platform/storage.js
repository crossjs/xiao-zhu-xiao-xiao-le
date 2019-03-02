var yyw;
(function (yyw) {
    yyw.storage = {
        remove(key) {
            return new Promise((resolve, reject) => {
                wx.removeStorage({
                    key,
                    success() {
                        resolve();
                    },
                    fail(e) {
                        resolve(null);
                    },
                });
            });
        },
        get(key) {
            return new Promise((resolve, reject) => {
                wx.getStorage({
                    key,
                    success({ data }) {
                        if (data) {
                            const { value, expiresAt } = data;
                            resolve((!expiresAt || expiresAt > Date.now()) ? value : null);
                        }
                        else {
                            resolve(null);
                            yyw.storage.remove(key);
                        }
                    },
                    fail(e) {
                        resolve(null);
                        yyw.storage.remove(key);
                    },
                });
            });
        },
        set(key, data, expiresIn) {
            return new Promise((resolve, reject) => {
                wx.setStorage({
                    key,
                    data: {
                        value: data,
                        expiresAt: expiresIn ? (Date.now() + expiresIn) : 0,
                    },
                    success() {
                        resolve();
                    },
                    fail(e) {
                        resolve(null);
                    },
                });
            });
        },
    };
})(yyw || (yyw = {}));
