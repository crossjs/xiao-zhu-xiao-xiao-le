import * as cloud from "wx-server-sdk";

cloud.init({ env: "releas-529ffe" });

export const main = async ({ fileID }, context) => {
  const { fileContent } = await cloud.downloadFile({ fileID });

  if (/\.json$/.test(fileID)) {
    return JSON.parse(fileContent.toString("utf8"));
  }

  return fileContent;
};
