const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { data } = await db
    .collection("tasks")
    .where({ enabled: true })
    .get();

  return data;
};
