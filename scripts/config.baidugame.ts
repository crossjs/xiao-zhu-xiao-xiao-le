import {
  CleanPlugin,
  CompilePlugin,
  EmitResConfigFilePlugin,
  ExmlPlugin,
  ManifestPlugin,
  TextureMergerPlugin,
  UglifyPlugin,
} from "built-in";
import * as path from "path";
import { BaidugamePlugin } from "./baidugame/baidugame";
import * as defaultConfig from "./config";
import { CustomPlugin } from "./myplugin";

const config: ResourceManagerConfig = {
  buildConfig: (params) => {
    const { target, command, projectName, version } = params;
    const outputDir = `../${projectName}_baidugame`;
    if (command === "build") {
      return {
        outputDir,
        commands: [
          new CleanPlugin({ matchers: ["js", "resource"] }),
          new CompilePlugin({
            libraryType: "debug",
            defines: { DEBUG: true, RELEASE: false },
          }),
          new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
          new BaidugamePlugin(),
          new ManifestPlugin({ output: "manifest.js" }),
        ],
      };
    } else if (command === "publish") {
      return {
        outputDir,
        commands: [
          new CleanPlugin({ matchers: ["js", "resource"] }),
          new CompilePlugin({
            libraryType: "release",
            defines: { DEBUG: false, RELEASE: true },
          }),
          new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
          new BaidugamePlugin(),
          new UglifyPlugin([
            {
              sources: ["main.js"],
              target: "main.min.js",
            },
          ]),
          new ManifestPlugin({ output: "manifest.js" }),
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
