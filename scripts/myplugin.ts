export class CustomPlugin implements plugins.Command {
  private buffer: any;

  public async onFile(file: plugins.File) {
    // 保存 manifest.js 文件的内容
    if (file.basename.indexOf("manifest.js") > -1) {
      this.buffer = file.contents;
    }
    return file;
  }

  public async onFinish(commandContext: plugins.CommandContext) {
    // 把 lib.min.js 移到第一位
    if (this.buffer) {
      const contents: string = this.buffer.toString();
      const arr = contents.split("\n");
      let lib: string = "";
      arr.forEach((item, index) => {
        if (item.indexOf("lib.min.js") > -1) {
          lib = item;
          arr.splice(index, 1);
        }
      });
      if (lib) {
        arr.unshift(lib);
      }
      const newContent = arr.join("\n");
      commandContext.createFile("manifest.js", new Buffer(newContent));
    }
  }
}
