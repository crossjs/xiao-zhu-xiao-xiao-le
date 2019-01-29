import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

export const Constants = {
  APP_ID: "wx2d01e63038198832",
  APP_NAME: "小猪消消乐",
  APP_IDS: ["wx2d01e63038198832", "wxb17a18edcbb93d0a"],
};

export class WxgamePlugin implements plugins.Command {
  private mode: string = "debug";

  constructor(mode: string) {
    this.mode = mode;
  }

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
          content += "\n;window.Main = Main;window.game = game;window.box = box;window.yyw = yyw;";
        }
        file.contents = new Buffer(content);
      }
    }
    return file;
  }

  public async onFinish(commandContext: plugins.CommandContext) {
    console.log("拷贝静态资源目录，比如 images");
    const imgSource = path.join(commandContext.projectRoot, "images");
    const imgTarget = path.join(commandContext.outputDir, "images");
    childProcess.execSync(`rm -Rf ${imgTarget}`, { stdio: "inherit" });
    childProcess.execSync(`cp -Rf ${imgSource} ${commandContext.outputDir}`, { stdio: "inherit" });

    console.log("拷贝 sub 目录（开放数据域）");
    // 拷贝 openDataContext
    const subSource = path.join(commandContext.projectRoot, "sub");
    const subTarget = path.join(commandContext.outputDir, "sub");
    childProcess.execSync(`rm -Rf ${subTarget}`, { stdio: "inherit" });
    childProcess.execSync(`cp -Rf ${subSource} ${commandContext.outputDir}`, { stdio: "inherit" });

    console.log("拷贝 template 目录");
    // 拷贝 template，无视 egret 提供的 template
    const wxgTemplate = path.join(__dirname, "template");
    childProcess.execSync(`cp -Rf ${wxgTemplate}/* ${commandContext.outputDir}`, { stdio: "inherit" });

    console.log("修改 project.config.json");
    const projectConfigPath = path.join(commandContext.outputDir, "project.config.json");
    const projectConfigContent = require(projectConfigPath);
    projectConfigContent.appid = Constants.APP_ID;
    projectConfigContent.projectname = Constants.APP_NAME;
    if (this.mode === "debug") {
      projectConfigContent.setting.urlCheck = false;
    }
    fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfigContent, null, 2), {
      encoding: "utf8",
    });

    console.log("修改 game.json");
    const gameConfigPath = path.join(commandContext.outputDir, "game.json");
    const gameConfigContent = require(gameConfigPath);
    gameConfigContent.navigateToMiniProgramAppIdList = Constants.APP_IDS;
    fs.writeFileSync(gameConfigPath, JSON.stringify(gameConfigContent, null, 2), {
      encoding: "utf8",
    });
  }
}
