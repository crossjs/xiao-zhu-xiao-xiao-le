import * as cloud from "wx-server-sdk";

cloud.init({ env: "releas-529ffe" });

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
