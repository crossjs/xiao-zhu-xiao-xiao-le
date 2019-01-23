import * as fs from "fs";
import * as path from "path";
import tinify from "tinify";

export class CustomPlugin implements plugins.Command {
  private mode: string = "debug";

  constructor(mode: string) {
    this.mode = mode;
  }

  public async onFile(file: plugins.File) {
    return file;
  }

  public async onFinish(commandContext: plugins.CommandContext) {
    //
  }
}
