import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

export const Constants = {
  APP_ID: "wx2d01e63038198832",
  APP_NAME: "小猪消消乐",
  APP_IDS: [
    "wxfed270b54f6a71f0",
    "wx954573275883779c",
    "wx88d09e8d4cff63ef",
    "wxb17a18edcbb93d0a",
    "wx644ce1d1c71f5a61",
    "wxc56ba41631181001",
    "wxc9ab31f29004c413",
    "wxcffba601f1ed2f43",
    "wx0e4b81e6ed9e6c44",
    "wxf188fab12df15673",
  ],
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

    console.log("修改 project.config.json");
    const projectConfigPath = path.join(pluginContext.outputDir, "project.config.json");
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
    const gameConfigPath = path.join(pluginContext.outputDir, "project.config.json");
    const gameConfigContent = require(gameConfigPath);
    gameConfigContent.navigateToMiniProgramAppIdList = Constants.APP_IDS;
    fs.writeFileSync(gameConfigPath, JSON.stringify(gameConfigContent, null, 2), {
      encoding: "utf8",
    });
  }
}
