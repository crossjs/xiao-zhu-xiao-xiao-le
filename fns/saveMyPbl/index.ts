import * as cloud from "wx-server-sdk";

cloud.init({ env: "dev-529ffe" });

const db = cloud.database();

export const main = async ({ score, level, combo }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  const doc = db
    .collection("users")
    .doc(openid);

  const { data } = await doc.get();

  const { result: { now }} = await cloud.callFunction({
    name: "dateUtil",
  });

  return await doc.update({
    data: {
      score: Math.max(data.score, score),
      level: 0,
      // level: Math.max(data.level, level),
      combo: Math.max(data.combo, combo),
      scores: data.scores + score,
      played: data.played + 1,
      updatedAt: now,
    },
  });
};
