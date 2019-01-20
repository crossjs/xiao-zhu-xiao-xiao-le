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
    console.log("拷贝静态资源目录，比如 images");
    const imgSource = path.join(pluginContext.projectRoot, "images");
    const imgTarget = path.join(pluginContext.outputDir, "images");
    childProcess.execSync(`rm -Rf ${imgTarget}`);
    childProcess.execSync(`cp -Rf ${imgSource} ${pluginContext.outputDir}`);

    console.log("拷贝 sub 目录（开放数据域）");
    // 拷贝 openDataContext
    const subSource = path.join(pluginContext.projectRoot, "sub");
    const subTarget = path.join(pluginContext.outputDir, "sub");
    childProcess.execSync(`rm -Rf ${subTarget}`);
    childProcess.execSync(`cp -Rf ${subSource} ${pluginContext.outputDir}`);

    console.log("拷贝 template 目录");
    // 拷贝 template，无视 egret 提供的 template
    const wxgTemplate = path.join(__dirname, "template");
    childProcess.execSync(`cp -Rf ${wxgTemplate}/* ${pluginContext.outputDir}`);
  }
}
