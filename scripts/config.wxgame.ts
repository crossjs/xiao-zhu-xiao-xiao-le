import {
  CleanPlugin,
  CompilePlugin,
  // EmitResConfigFilePlugin,
  ExmlPlugin,
  ManifestPlugin,
  // TextureMergerPlugin,
  UglifyPlugin,
} from "built-in";
import * as defaultConfig from "./config";
// import { CustomPlugin } from "./myplugin";
import { WxgamePlugin } from "./wxgame/wxgame";

const config: ResourceManagerConfig = {
  buildConfig: (params) => {
    const { target, command, projectName, version = "0.0.0" } = params;
    const outputDir = `../${projectName}_wxgame`;
    if (command === "build") {
      return {
        outputDir,
        commands: [
          new CleanPlugin({ matchers: ["js", "resource"] }),
          new CompilePlugin({
            libraryType: "debug",
            defines: { DEBUG: process.env.NODE_ENV !== "TEST", RELEASE: false, VERSION: version },
          }),
          new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
          new WxgamePlugin(),
          new ManifestPlugin({ output: "manifest.js" }),
          // new CustomPlugin(),
        ],
      };
    } else if (command === "publish") {
      return {
        outputDir,
        commands: [
          new CleanPlugin({ matchers: ["js", "resource"] }),
          new CompilePlugin({
            libraryType: "release",
            defines: { DEBUG: false, RELEASE: true, VERSION: version },
          }),
          new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
          new WxgamePlugin(),
          new UglifyPlugin([
            {
              sources: ["main.js"],
              target: "main.min.js",
            },
            // {
            //   sources: ["resource/default.thm.js"],
            //   target: "resource/default.thm.min.js",
            // },
          ]),
          new ManifestPlugin({ output: "manifest.js" }),
          // new CustomPlugin(),
        ],
      };
    } else {
      throw new Error(`unknown command : ${params.command}`);
    }
  },

  mergeSelector: defaultConfig.mergeSelector,

  typeSelector: defaultConfig.typeSelector,
};

export = config;