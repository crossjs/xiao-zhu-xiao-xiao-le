var yyw;
(function (yyw) {
    yyw.db = {
        async remove(key) {
            return yyw.cloud.call("removeStorage", { key });
        },
        async get(key) {
            const data = await yyw.cloud.call("getStorage", { key });
            if (data) {
                const { value, expiresAt } = data;
                if (!expiresAt || expiresAt > Date.now()) {
                    return value;
                }
                yyw.db.remove(key);
            }
            return null;
        },
        async set(key, data, expiresIn) {
            return yyw.cloud.call("setStorage", {
                key,
                data: {
                    data: {
                        value: data,
                        expiresAt: expiresIn ? (Date.now() + expiresIn) : 0,
                    },
                },
            });
        },
    };
})(yyw || (yyw = {}));
