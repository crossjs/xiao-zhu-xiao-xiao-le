/**
 * 带过期时间的缓存库
 */
var yyw;
(function (yyw) {
    yyw.storage = {
        /**
         * 清除指定键的值
         * @param key 键
         */
        remove: function (key) {
            return new Promise(function (resolve, reject) {
                wx.removeStorage({
                    key: key,
                    success: function () {
                        resolve();
                    },
                    fail: function (e) {
                        resolve(null);
                    },
                });
            });
        },
        /**
         * 获取指定键的值
         * @param key 键
         */
        get: function (key) {
            return new Promise(function (resolve, reject) {
                wx.getStorage({
                    key: key,
                    success: function (_a) {
                        var data = _a.data;
                        if (data) {
                            var value = data.value, expiresAt = data.expiresAt;
                            resolve((!expiresAt || expiresAt > Date.now()) ? value : null);
                        }
                        else {
                            resolve(null);
                            yyw.storage.remove(key);
                        }
                    },
                    fail: function (e) {
                        resolve(null);
                        yyw.storage.remove(key);
                    },
                });
            });
        },
        /**
         * 设置指定键的值
         * @param key 键
         * @param data 值
         * @param expiresIn 过期毫秒数
         */
        set: function (key, data, expiresIn) {
            return new Promise(function (resolve, reject) {
                wx.setStorage({
                    key: key,
                    data: {
                        value: data,
                        expiresAt: expiresIn ? (Date.now() + expiresIn) : 0,
                    },
                    success: function () {
                        resolve();
                    },
                    fail: function (e) {
                        resolve(null);
                    },
                });
            });
        },
    };
})(yyw || (yyw = {}));
