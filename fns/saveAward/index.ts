import * as cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async ({ coins = 0, points = 0 }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  const doc = db
    .collection("users")
    .doc(openid);

  const { data } = await doc.get();

  const toCoins = data.coins + coins;
  const toPoints = data.points + points;

  if (toCoins < 0 || toPoints < 0) {
    throw new Error("余额不足");
  }

  return await doc.update({
    data: {
      coins: toCoins,
      points: toPoints,
    },
  });
};
