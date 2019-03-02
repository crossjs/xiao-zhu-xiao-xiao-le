import cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async ({ key }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  return await db
    .collection("storage")
    .doc(`${openid}-${key}`)
    .remove();
};
