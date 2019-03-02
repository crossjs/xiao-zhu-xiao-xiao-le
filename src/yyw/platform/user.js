var yyw;
(function (yyw) {
    const USER_KEY = "USER";
    yyw.USER = {};
    function getUserInfo() {
        return new Promise((resolve) => {
            wx.getUserInfo({
                withCredentials: false,
                success({ errMsg, userInfo }) {
                    if (errMsg === "getUserInfo:ok") {
                        resolve(userInfo);
                    }
                    else {
                        resolve(null);
                    }
                },
                fail() {
                    resolve(null);
                },
            });
        });
    }
    function isScopeAuthorized(scope = "userInfo") {
        return new Promise((resolve) => {
            wx.getSetting({
                success(res) {
                    resolve(res.authSetting[`scope.${scope}`] === true);
                },
                fail() {
                    resolve(false);
                },
            });
        });
    }
    async function login(fullUserInfo) {
        const isLoggedIn = !!yyw.USER.openid;
        if (!fullUserInfo) {
            fullUserInfo = await getUserInfo();
        }
        const currentUser = await yyw.cloud.call("login", { fullUserInfo });
        Object.assign(yyw.USER, currentUser);
        await yyw.storage.set(USER_KEY, yyw.USER);
        if (!isLoggedIn) {
            yyw.emit("LOGIN");
        }
        return yyw.USER;
    }
    async function logout() {
        for (const key in yyw.USER) {
            if (yyw.USER.hasOwnProperty(key)) {
                delete yyw.USER[key];
            }
        }
        await yyw.storage.remove(USER_KEY);
        yyw.emit("LOGOUT");
    }
    yyw.logout = logout;
    async function getLogin() {
        if (!yyw.USER.openid) {
            const cachedUser = await yyw.storage.get(USER_KEY);
            if (cachedUser) {
                Object.assign(yyw.USER, cachedUser);
            }
        }
        if (!yyw.USER.openid) {
            await login();
        }
        return !!yyw.USER.openid;
    }
    yyw.getLogin = getLogin;
    async function createUserInfoButton({ left, top, width, height, onTap, }) {
        const authorized = await isScopeAuthorized("userInfo");
        if (authorized) {
            return;
        }
        const scale = 750 / yyw.CONFIG.systemInfo.windowWidth;
        const button = wx.createUserInfoButton({
            type: "text",
            style: {
                left: left / scale,
                top: top / scale,
                width: width / scale,
                height: height / scale,
                lineHeight: 0,
                backgroundColor: "transparent",
                color: "transparent",
                textAlign: "center",
                fontSize: 0,
                borderRadius: 0,
                borderColor: "transparent",
                borderWidth: 0,
            },
            withCredentials: false,
        });
        button.onTap(async ({ errMsg, userInfo }) => {
            button.destroy();
            let authorized = true;
            try {
                if (errMsg === "getUserInfo:ok") {
                    await login(userInfo);
                }
                else {
                    authorized = false;
                    const isLoggedIn = await getLogin();
                    if (!isLoggedIn) {
                        await login();
                    }
                }
            }
            catch (error) {
                await login();
            }
            if (onTap) {
                onTap(authorized);
            }
        });
        return button;
    }
    yyw.createUserInfoButton = createUserInfoButton;
})(yyw || (yyw = {}));
