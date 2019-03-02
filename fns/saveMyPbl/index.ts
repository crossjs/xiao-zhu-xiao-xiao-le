import * as cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async ({ score, level, combo }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  const doc = db
    .collection("users")
    .doc(openid);

  const { data } = await doc.get();

  return await doc.update({
    data: {
      score: Math.max(data.score, score),
      level: Math.max(data.level, level),
      combo: Math.max(data.combo, combo),
      scores: data.scores + score,
      played: data.played + 1,
    },
  });
};
