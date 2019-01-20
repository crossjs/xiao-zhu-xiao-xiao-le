import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

export class WxgamePlugin implements plugins.Command {
  // constructor() {}
  public async onFile(file: plugins.File) {
    if (file.extname === ".js") {
      const filename = file.origin;
      if (
        filename === "libs/modules/promise/promise.js" ||
        filename === "libs/modules/promise/promise.min.js"
      ) {
        return null;
      }
      if (
        filename === "libs/modules/egret/egret.js" ||
        filename === "libs/modules/egret/egret.min.js"
      ) {
        let content = file.contents.toString();
        content += `;window.egret = egret;`;
        content = content.replace(
          /definition = __global/,
          "definition = window",
        );
        file.contents = new Buffer(content);
      } else {
        let content = file.contents.toString();
        if (
          filename === "libs/modules/res/res.js" ||
          filename === "libs/modules/res/res.min.js" ||
          filename === "libs/modules/assetsmanager/assetsmanager.min.js" ||
          filename === "libs/modules/assetsmanager/assetsmanager.js"
        ) {
          content += ";window.RES = RES;";
        }
        if (
          filename === "libs/modules/eui/eui.js" ||
          filename === "libs/modules/eui/eui.min.js"
        ) {
          content += ";window.eui = eui;";
        }
        if (
          filename === "libs/modules/dragonBones/dragonBones.js" ||
          filename === "libs/modules/dragonBones/dragonBones.min.js"
        ) {
          content += ";window.dragonBones = dragonBones";
        }
        content = "var egret = window.egret;" + content;
        if (filename === "main.js") {
          content += "\n;window.Main = Main;";
        }
        file.contents = new Buffer(content);
      }
    }
    return file;
  }

  public async onFinish(pluginContext: plugins.CommandContext) {
    // 移除 openDataContext
    const odcTgtPath = path.join(pluginContext.outputDir, "openDataContext");
    childProcess.execSync(`rm -Rf ${odcTgtPath}`);

    console.log("拷贝 template 目录，包括 openDataContext");
    // 拷贝 template，无视 egret 提供的 template
    const wxgTplPath = path.join(__dirname, "template");
    childProcess.execSync(`cp -Rf ${wxgTplPath}/* ${pluginContext.outputDir}`);
  }
}
