const fs = require("fs");
const path = require("path");
const tinify = require("tinify");

tinify.key = "tXx0hXGCSQGmscmLlTZWZYdGDjq05csP";

const targets = process.argv.slice(2);

function compress(folder) {
  const folderPath = path.join(process.cwd(), folder);
  return Promise.all(
    fs.readdirSync(folderPath).map(async (file) => {
      if (/(?:jpg|png)$/.test(file)) {
        console.log(`压缩 ${folder}/${file}，……`);
        const filePath = path.join(folderPath, file);
        await tinify.fromFile(filePath).toFile(filePath);
        console.log(`压缩 ${folder}/${file}，完成！`);
      }
    })
  );
}

console.log("可用的参数：i/r/s");

const tasks = [];

if (targets.indexOf("i") !== -1) {
  console.log("压缩 images");
  tasks.push(compress("images"));
}

if (targets.indexOf("r") !== -1) {
  console.log("压缩 resource/assets");
  tasks.push(compress("resource/assets"));
}

if (targets.indexOf("s") !== -1) {
  console.log("压缩 sub/assets");
  tasks.push(compress("sub/assets"));
}

Promise.all(tasks).then(() => {
  console.log("all done!");
  process.exit(0);
}) .catch((e) => {
  console.error(e);
  process.exit(1);
});
