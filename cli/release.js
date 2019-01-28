const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const filePath = path.join(process.cwd(), "package.json");

if (fs.existsSync(filePath)) {
  console.log("备份 package.json");
  const content = fs.readFileSync(filePath);
  console.log("移除 package.json");
  fs.unlinkSync(filePath);
  console.log("执行 egret publish");
  try {
    childProcess.execSync("egret publish", { stdio: "inherit" });
  } catch (error) {
    console.error(error);
  }
  console.log("恢复 package.json");
  fs.writeFileSync(filePath, content);
}

process.exit(0);
