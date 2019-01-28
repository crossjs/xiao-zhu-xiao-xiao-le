namespace yyw {
  /**
   * 封装微信小游戏的文件系统
   */
  const wxFS = wx.getFileSystemManager();
  const WX_ROOT = wx.env.USER_DATA_PATH + "/";

  const fs_cache = {};

  function setFsCache(p: string, value: number) {
    fs_cache[p] = value;
  }

  function walkFile(dirname: string, callback: any) {
    const files = wxFS.readdirSync(dirname);
    for (const f of files) {
      const file = dirname + "/" + f;
      const stat = wxFS.statSync(file);
      if (stat.isDirectory()) {
        walkFile(file, callback);
      } else {
        callback(file);
      }
    }
  }

  function walkDir(dirname: string, callback: any) {
    const files = wxFS.readdirSync(dirname);
    for (const f of files) {
      const file = dirname + "/" + f;
      const stat = wxFS.statSync(file);
      if (stat.isDirectory()) {
        walkDir(file, callback);
        callback(file);
      }
    }
  }

  function downloadFile(url: string, localPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const dirname = path.dirname(localPath);
      fs.mkdirpSync(dirname);
      const filePath = path.getWxUserPath(localPath);
      wx.downloadFile({
        url,
        filePath,
        success: (v) => {
          if (v.statusCode >= 400) {
            try {
              wxFS.accessSync(filePath);
              wxFS.unlinkSync(filePath);
            } catch (error) {
              egret.error(error);
            }
            reject(`加载失败：${url}`);
          } else {
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

  export const fs = {
    /**
     * 遍历删除文件夹
     */
    remove: (dirname: string) => {
      if (!fs.existsSync(dirname)) { return; }
      const globalDirname = WX_ROOT + dirname;
      walkFile(globalDirname, (file) => {
        wxFS.unlinkSync(file);
        let p = file.replace(WX_ROOT, "");
        p = path.normalize(p);
        if (fs_cache[p]) {
          fs_cache[p] = 0;
        }
      });
      walkDir(globalDirname, (dir: string) => {
        wxFS.rmdirSync(dir);
        let p = dir.replace(WX_ROOT, "");
        p = path.normalize(p);
        if (fs_cache[p]) {
          fs_cache[p] = 0;
        }
      });
    },

    /**
     * 检查文件是否存在
     */
    existsSync: (p: string): boolean => {
      const cache = fs_cache[p];
      if (cache === 0) {
        return false;
      }
      if (cache === 1) {
        return true;
      }
      try {
        wxFS.accessSync(WX_ROOT + p);
        p = path.normalize(p);
        if (p) {
          fs_cache[p] = 1;
        }
        return true;
      } catch (e) {
        p = path.normalize(p);
        fs_cache[p] = 0;
        return false;
      }
    },

    writeSync: (p: string, content: any) => {
      p = path.normalize(p);
      fs_cache[p] = 1;
      wxFS.writeFileSync(WX_ROOT + p, content);
    },

    readSync: (p: string, format: string = "utf-8") => {
      return wxFS.readFileSync(WX_ROOT + p, format);
    },

    /**
     * 创建文件夹
     */
    mkdirpSync: (p: string) => {
      if (!fs.existsSync(p)) {
        const dirs = p.split("/");
        let current = "";
        for (let i = 0; i < dirs.length; i++) {
          const dir = dirs[i];
          current += dir + "/";
          if (!fs.existsSync(current)) {
            const p = path.normalize(current);
            fs_cache[p] = 1;
            wxFS.mkdirSync(WX_ROOT + current);
          }
        }
      }
    },

    /**
     * 解压 zip 文件
     */
    unzip: (zipFilePath: string, targetPath: string): Promise<any> => {
      zipFilePath = WX_ROOT + zipFilePath;
      targetPath = WX_ROOT + targetPath;
      return new Promise((resolve, reject) => {
        wxFS.unzip({
          zipFilePath,
          targetPath,
          success: () => {
            resolve();
          },
          fail(e) {
            reject(e);
          },
        });
      });
    },

    ensure: async (filePath: string): Promise<string> => {
      // 通过缓存机制加载
      const localPath = path.getLocalPath(filePath);
      if (!fs.existsSync(localPath)) {
        try {
          await downloadFile(filePath, localPath);
        } catch (error) {
          egret.error(error);
          return filePath;
        }
      }
      return path.getWxUserPath(localPath);
    },
  };
}
