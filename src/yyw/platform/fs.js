var yyw;
(function (yyw) {
    const wxFS = wx.getFileSystemManager();
    const WX_ROOT = `${wx.env.USER_DATA_PATH}/`;
    const fs_cache = {};
    function setFsCache(p, value) {
        fs_cache[p] = value;
    }
    function walkFile(dirname, callback) {
        const files = wxFS.readdirSync(dirname);
        for (const f of files) {
            const file = `${dirname}/${f}`;
            const stat = wxFS.statSync(file);
            if (stat.isDirectory()) {
                walkFile(file, callback);
            }
            else {
                callback(file);
            }
        }
    }
    function walkDir(dirname, callback) {
        const files = wxFS.readdirSync(dirname);
        for (const f of files) {
            const file = `${dirname}/${f}`;
            const stat = wxFS.statSync(file);
            if (stat.isDirectory()) {
                walkDir(file, callback);
                callback(file);
            }
        }
    }
    function downloadFile(url, localPath) {
        return new Promise((resolve, reject) => {
            const dirname = yyw.path.dirname(localPath);
            yyw.fs.mkdirpSync(dirname);
            const filePath = yyw.path.getWxUserPath(localPath);
            wx.downloadFile({
                url,
                filePath,
                success: (v) => {
                    if (v.statusCode >= 400) {
                        try {
                            wxFS.accessSync(filePath);
                            wxFS.unlinkSync(filePath);
                        }
                        catch (error) {
                            egret.error(error);
                        }
                        reject(`加载失败：${url}`);
                    }
                    else {
                        setFsCache(localPath, 1);
                        resolve();
                    }
                },
                fail: (e) => {
                    reject(e);
                },
            });
        });
    }
    yyw.fs = {
        remove: (dirname) => {
            if (!yyw.fs.existsSync(dirname)) {
                return;
            }
            const globalDirname = `${WX_ROOT}${dirname}`;
            walkFile(globalDirname, (file) => {
                wxFS.unlinkSync(file);
                let p = file.replace(WX_ROOT, "");
                p = yyw.path.normalize(p);
                if (fs_cache[p]) {
                    fs_cache[p] = 0;
                }
            });
            walkDir(globalDirname, (dir) => {
                wxFS.rmdirSync(dir);
                let p = dir.replace(WX_ROOT, "");
                p = yyw.path.normalize(p);
                if (fs_cache[p]) {
                    fs_cache[p] = 0;
                }
            });
        },
        existsSync: (p) => {
            const cache = fs_cache[p];
            if (cache === 0) {
                return false;
            }
            if (cache === 1) {
                return true;
            }
            try {
                wxFS.accessSync(`${WX_ROOT}${p}`);
                p = yyw.path.normalize(p);
                if (p) {
                    fs_cache[p] = 1;
                }
                return true;
            }
            catch (e) {
                p = yyw.path.normalize(p);
                fs_cache[p] = 0;
                return false;
            }
        },
        writeSync: (p, content) => {
            p = yyw.path.normalize(p);
            fs_cache[p] = 1;
            wxFS.writeFileSync(`${WX_ROOT}${p}`, content);
        },
        readSync: (p, format = "utf-8") => {
            return wxFS.readFileSync(`${WX_ROOT}${p}`, format);
        },
        mkdirpSync: (p) => {
            if (!yyw.fs.existsSync(p)) {
                const dirs = p.split("/");
                let current = "";
                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    current += dir + "/";
                    if (!yyw.fs.existsSync(current)) {
                        const p = yyw.path.normalize(current);
                        fs_cache[p] = 1;
                        wxFS.mkdirSync(WX_ROOT + current);
                    }
                }
            }
        },
        unzip: (zipFilePath, targetPath) => {
            return new Promise((resolve, reject) => {
                wxFS.unzip({
                    zipFilePath: `${WX_ROOT}${zipFilePath}`,
                    targetPath: `${WX_ROOT}${targetPath}`,
                    success: () => {
                        resolve();
                    },
                    fail(e) {
                        reject(e);
                    },
                });
            });
        },
        ensure: async (filePath) => {
            const localPath = yyw.path.getLocalPath(filePath);
            if (!yyw.fs.existsSync(localPath)) {
                try {
                    await downloadFile(filePath, localPath);
                }
                catch (error) {
                    egret.error(error);
                    return filePath;
                }
            }
            return yyw.path.getWxUserPath(localPath);
        },
    };
})(yyw || (yyw = {}));
