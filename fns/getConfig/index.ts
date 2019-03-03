import * as cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async (event: any, context: any) => {
  const { data: [ config ] } = await db
    .collection("configs")
    .limit(1)
    .where({ enabled: true })
    .get();

  return config;
};
