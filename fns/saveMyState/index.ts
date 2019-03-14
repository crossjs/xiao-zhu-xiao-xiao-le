import * as cloud from "wx-server-sdk";

cloud.init({ env: "dev-529ffe" });

const db = cloud.database();

export const main = async ({ state }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  const doc = db
    .collection("users")
    .doc(openid);

  const { result: { now }} = await cloud.callFunction({
    name: "dateUtil",
  });

  if (state.arena) {
    delete state.arena;
  }

  return await doc.update({
    data: {
      ...state,
      updatedAt: now,
    },
  });
};
