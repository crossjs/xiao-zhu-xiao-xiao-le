import * as cloud from "wx-server-sdk";

cloud.init({ env: "dev-529ffe" });

const db = cloud.database();

export const main = async ({ key }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  return await db
    .collection("storage")
    .doc(`${openid}-${key}`)
    .remove();
};
