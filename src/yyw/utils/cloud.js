var yyw;
(function (yyw) {
    wx.cloud.init({
        env: CLOUD_ENV,
        traceUser: true,
    });
    yyw.cloud = {
        async call(name, data) {
            return new Promise((resolve, reject) => {
                wx.cloud.callFunction({
                    name,
                    data,
                    success: ({ result }) => {
                        resolve(result);
                    },
                    fail: (err) => {
                        reject(err);
                    },
                });
            });
        },
    };
})(yyw || (yyw = {}));
