const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

exports.main = async ({ key }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  try {
    const { data: { data } } = await db
      .collection("storage")
      .doc(`${openid}-${key}`)
      .get();

    return data;
  } catch (error) {
    console.error(error);
  }
};
