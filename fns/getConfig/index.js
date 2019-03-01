const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { data: [ config ] } = await db
    .collection("configs")
    .limit(1)
    .where({ enabled: true })
    .get();

  return config;
};
