import * as cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async ({ key, data }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  return await db
    .collection("storage")
    .doc(`${openid}-${key}`)
    .set({
      data,
    });
};
