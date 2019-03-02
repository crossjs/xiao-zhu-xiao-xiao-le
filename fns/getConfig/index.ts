import cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async (event, context) => {
  const { data: [ config ] } = await db
    .collection("configs")
    .limit(1)
    .where({ enabled: true })
    .get();

  return config;
};
