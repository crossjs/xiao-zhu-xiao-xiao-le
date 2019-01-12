import {
  CleanPlugin,
  CompilePlugin,
  EmitResConfigFilePlugin,
  ExmlPlugin,
  ManifestPlugin,
  TextureMergerPlugin,
  UglifyPlugin,
} from "built-in";
import { BricksPlugin } from "./bricks/bricks";
import * as defaultConfig from "./config";

const config: ResourceManagerConfig = {
  buildConfig: (params) => {
    const { target, command, projectName, version } = params;
    const outputDir = `../${projectName}_bricks/PublicBrickEngineGame/Res`;
    if (command === "build") {
      return {
        outputDir,
        commands: [
          new CompilePlugin({
            libraryType: "debug",
            defines: { DEBUG: true, RELEASE: false },
          }),
          new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
          new ManifestPlugin({ output: "manifest.json" }),
          new BricksPlugin(),
        ],
      };
    } else if (command === "publish") {
      console.log("执行publish");
      return {
        outputDir,
        commands: [
          new CompilePlugin({
            libraryType: "debug",
            defines: { DEBUG: true, RELEASE: false },
          }),
          new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
          new ManifestPlugin({ output: "manifest.json" }),
          new UglifyPlugin([
            {
              sources: ["main.js"],
              target: "js/main.min.js",
            },
          ]),
          new BricksPlugin(),
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
