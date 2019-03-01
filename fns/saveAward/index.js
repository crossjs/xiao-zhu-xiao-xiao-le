const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

exports.main = async ({ coins = 0, points = 0 }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  const doc = db
    .collection("users")
    .doc(openid);

  const { data } = await doc.get();

  return await doc.update({
    data: {
      coins: data.coins + coins,
      points: data.points + points,
    }
  });
};
