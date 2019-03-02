const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  try {
    const { data } = await db
      .collection("users")
      .doc(openid)
      .field({
        _id: false,
        score: true,
        level: true,
        combo: true,
        points: true,
        coins: true,
        scores: true,
        played: true,
      })
      .get();
    return data;
  } catch (error) {
    console.error(error);
  }

  return {};
};
