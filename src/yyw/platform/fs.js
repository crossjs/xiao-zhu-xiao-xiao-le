var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var yyw;
(function (yyw) {
    var _this = this;
    /**
     * 封装微信小游戏的文件系统
     */
    var wxFS = wx.getFileSystemManager();
    var WX_ROOT = wx.env.USER_DATA_PATH + "/";
    var fs_cache = {};
    function setFsCache(p, value) {
        fs_cache[p] = value;
    }
    function walkFile(dirname, callback) {
        var e_1, _a;
        var files = wxFS.readdirSync(dirname);
        try {
            for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                var f = files_1_1.value;
                var file = dirname + "/" + f;
                var stat = wxFS.statSync(file);
                if (stat.isDirectory()) {
                    walkFile(file, callback);
                }
                else {
                    callback(file);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function walkDir(dirname, callback) {
        var e_2, _a;
        var files = wxFS.readdirSync(dirname);
        try {
            for (var files_2 = __values(files), files_2_1 = files_2.next(); !files_2_1.done; files_2_1 = files_2.next()) {
                var f = files_2_1.value;
                var file = dirname + "/" + f;
                var stat = wxFS.statSync(file);
                if (stat.isDirectory()) {
                    walkDir(file, callback);
                    callback(file);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (files_2_1 && !files_2_1.done && (_a = files_2.return)) _a.call(files_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function downloadFile(url, localPath) {
        return new Promise(function (resolve, reject) {
            var dirname = yyw.path.dirname(localPath);
            yyw.fs.mkdirpSync(dirname);
            var filePath = yyw.path.getWxUserPath(localPath);
            wx.downloadFile({
                url: url,
                filePath: filePath,
                success: function (v) {
                    if (v.statusCode >= 400) {
                        try {
                            wxFS.accessSync(filePath);
                            wxFS.unlinkSync(filePath);
                        }
                        catch (error) {
                            egret.error(error);
                        }
                        reject("\u52A0\u8F7D\u5931\u8D25\uFF1A" + url);
                    }
                    else {
                        setFsCache(localPath, 1);
                        resolve();
                    }
                },
                fail: function (e) {
                    reject(e);
                },
            });
        });
    }
    yyw.fs = {
        /**
         * 遍历删除文件夹
         */
        remove: function (dirname) {
            if (!yyw.fs.existsSync(dirname)) {
                return;
            }
            var globalDirname = "" + WX_ROOT + dirname;
            // 删除文件
            walkFile(globalDirname, function (file) {
                wxFS.unlinkSync(file);
                var p = file.replace(WX_ROOT, "");
                p = yyw.path.normalize(p);
                if (fs_cache[p]) {
                    fs_cache[p] = 0;
                }
            });
            // 删除文件夹
            walkDir(globalDirname, function (dir) {
                wxFS.rmdirSync(dir);
                var p = dir.replace(WX_ROOT, "");
                p = yyw.path.normalize(p);
                if (fs_cache[p]) {
                    fs_cache[p] = 0;
                }
            });
        },
        /**
         * 检查文件是否存在
         */
        existsSync: function (p) {
            var cache = fs_cache[p];
            if (cache === 0) {
                return false;
            }
            if (cache === 1) {
                return true;
            }
            try {
                wxFS.accessSync("" + WX_ROOT + p);
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
        writeSync: function (p, content) {
            p = yyw.path.normalize(p);
            fs_cache[p] = 1;
            wxFS.writeFileSync("" + WX_ROOT + p, content);
        },
        readSync: function (p, format) {
            if (format === void 0) { format = "utf-8"; }
            return wxFS.readFileSync("" + WX_ROOT + p, format);
        },
        /**
         * 创建文件夹
         */
        mkdirpSync: function (p) {
            if (!yyw.fs.existsSync(p)) {
                var dirs = p.split("/");
                var current = "";
                for (var i = 0; i < dirs.length; i++) {
                    var dir = dirs[i];
                    current += dir + "/";
                    if (!yyw.fs.existsSync(current)) {
                        var p_1 = yyw.path.normalize(current);
                        fs_cache[p_1] = 1;
                        wxFS.mkdirSync(WX_ROOT + current);
                    }
                }
            }
        },
        /**
         * 解压 zip 文件
         */
        unzip: function (zipFilePath, targetPath) {
            return new Promise(function (resolve, reject) {
                wxFS.unzip({
                    zipFilePath: "" + WX_ROOT + zipFilePath,
                    targetPath: "" + WX_ROOT + targetPath,
                    success: function () {
                        resolve();
                    },
                    fail: function (e) {
                        reject(e);
                    },
                });
            });
        },
        ensure: function (filePath) { return __awaiter(_this, void 0, void 0, function () {
            var localPath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        localPath = yyw.path.getLocalPath(filePath);
                        if (!!yyw.fs.existsSync(localPath)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, downloadFile(filePath, localPath)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        egret.error(error_1);
                        return [2 /*return*/, filePath];
                    case 4: return [2 /*return*/, yyw.path.getWxUserPath(localPath)];
                }
            });
        }); },
    };
})(yyw || (yyw = {}));
